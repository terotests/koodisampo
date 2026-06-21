/**
 * Yksi stdin-kuuntelija koko pelille — estää usean raw-listenerin kilpailun.
 */

const QUIT_KEY_NAMES = new Set(["ctrl-c", "ctrl-d", "ctrl-x", "esc", "q"]);

export function isQuitKeyName(name) {
  return QUIT_KEY_NAMES.has(name);
}

const ARROW_ALT = { A: "up", B: "down", C: "right", D: "left" };

function parseChunk(buffer) {
  if (buffer === "\u0003") return { name: "ctrl-c", consumed: buffer.length };
  if (buffer === "\u0004") return { name: "ctrl-d", consumed: buffer.length };
  if (buffer === "\u0018") return { name: "ctrl-x", consumed: buffer.length };
  if (buffer === "\u001b") return { name: "esc", consumed: buffer.length };
  if (buffer === "?") return { name: "?", consumed: buffer.length };

  const arrow = buffer.match(/^\u001b\[([A-D])(?:\u001b)?$/);
  if (arrow) {
    return { name: ARROW_ALT[arrow[1]], consumed: arrow[0].length };
  }

  if (buffer.length >= 3 && buffer.startsWith("\u001b[")) {
    return null;
  }

  if (buffer.length === 1) {
    return { name: buffer.toLowerCase(), consumed: 1 };
  }

  if (buffer.length > 0) {
    return { name: "unknown", consumed: buffer.length };
  }

  return null;
}

class StdinHub {
  constructor() {
    this.stdin = process.stdin;
    this.buffer = "";
    this.waiter = null;
    this.listening = false;
    this.disconnected = false;
    this.onData = this.handleData.bind(this);
    this.onStdinError = this.handleStdinError.bind(this);
    this.onStdinEnd = this.handleStdinDisconnect.bind(this);
  }

  get isTTY() {
    return this.stdin.isTTY;
  }

  ensureListening() {
    if (!this.stdin.isTTY || this.listening || this.disconnected) return;
    this.stdin.setRawMode(true);
    this.stdin.resume();
    this.stdin.setEncoding("utf8");
    this.stdin.on("data", this.onData);
    this.stdin.on("error", this.onStdinError);
    this.stdin.on("end", this.onStdinEnd);
    this.listening = true;
  }

  detachListeners() {
    this.stdin.removeListener("data", this.onData);
    this.stdin.removeListener("error", this.onStdinError);
    this.stdin.removeListener("end", this.onStdinEnd);
  }

  handleStdinError(err) {
    const code = err?.code;
    if (code === "EIO" || code === "EPIPE" || code === "EBADF") {
      this.handleStdinDisconnect();
      return;
    }
    console.error(err);
    this.handleStdinDisconnect();
  }

  handleStdinDisconnect() {
    if (this.disconnected) return;
    this.disconnected = true;
    this.buffer = "";
    try {
      if (this.listening) {
        this.detachListeners();
        if (this.stdin.isTTY) this.stdin.setRawMode(false);
        this.stdin.pause();
      }
    } catch {
      // stdin already closed
    }
    this.listening = false;
    this.finishWaiterAsQuit("disconnect");
  }

  finishWaiterAsQuit(key = "disconnect") {
    if (!this.waiter) return;
    const w = this.waiter;
    this.waiter = null;
    if (w.mode === "line") {
      w.resolve({ type: "quit", key });
      return;
    }
    w.resolve({ type: "key", key });
  }

  pause() {
    if (!this.listening) return;
    try {
      this.detachListeners();
      this.buffer = "";
      if (this.stdin.isTTY) this.stdin.setRawMode(false);
      this.stdin.pause();
    } catch {
      // stdin already closed
    }
    this.listening = false;
    this.finishWaiterAsQuit("paused");
  }

  close() {
    this.pause();
  }

  handleData(chunk) {
    this.buffer += chunk;
    while (this.buffer.length > 0 && this.waiter) {
      if (this.waiter.mode === "line") {
        if (!this.consumeLineChunk()) break;
        continue;
      }
      const parsed = parseChunk(this.buffer);
      if (!parsed) break;
      this.buffer = this.buffer.slice(parsed.consumed);
      const w = this.waiter;
      this.waiter = null;
      w.resolve({ type: "key", key: parsed.name });
    }
  }

  consumeLineChunk() {
    const buffer = this.buffer;
    if (buffer.startsWith("\u0003")) {
      this.buffer = buffer.slice(1);
      this.finishWaiter({ type: "quit", key: "ctrl-c" });
      return true;
    }
    if (buffer.startsWith("\u0004")) {
      this.buffer = buffer.slice(1);
      this.finishWaiter({ type: "quit", key: "ctrl-d" });
      return true;
    }
    if (buffer.startsWith("\u0018")) {
      this.buffer = buffer.slice(1);
      this.finishWaiter({ type: "quit", key: "ctrl-x" });
      return true;
    }
    if (buffer.startsWith("\u001b")) {
      const arrow = buffer.match(/^\u001b\[([A-D])(?:\u001b)?/);
      if (arrow) {
        this.buffer = buffer.slice(arrow[0].length);
        return true;
      }
      if (buffer.length > 1 && buffer[1] === "[" && buffer.length < 3) {
        return false;
      }
      this.buffer = buffer.slice(1);
      this.finishWaiter({ type: "quit", key: "esc" });
      return true;
    }

    const ch = buffer[0];
    this.buffer = buffer.slice(1);

    if (ch === "\r" || ch === "\n") {
      const value = this.waiter.line;
      this.finishWaiter({ type: "line", value: value.trim() });
      return true;
    }
    if (ch === "\u007f" || ch === "\b") {
      if (this.waiter.line.length > 0) {
        this.waiter.line = this.waiter.line.slice(0, -1);
        process.stdout.write("\b \b");
      }
      return true;
    }
    if (ch === "q" || ch === "Q") {
      this.finishWaiter({ type: "quit", key: "q" });
      return true;
    }
    if (ch >= " " && ch <= "~") {
      this.waiter.line += ch;
      process.stdout.write(ch);
      return true;
    }
    return true;
  }

  finishWaiter(result) {
    const w = this.waiter;
    this.waiter = null;
    w?.resolve(result);
  }

  readKey() {
    if (this.disconnected) {
      return Promise.resolve({ name: "disconnect" });
    }
    this.ensureListening();
    const parsed = parseChunk(this.buffer);
    if (parsed && !this.waiter) {
      this.buffer = this.buffer.slice(parsed.consumed);
      return Promise.resolve({ name: parsed.name });
    }
    if (this.waiter) {
      return Promise.reject(new Error("stdin busy"));
    }
    return new Promise((resolve, reject) => {
      this.waiter = {
        mode: "key",
        resolve: (r) => resolve({ name: r.key }),
        reject,
      };
    });
  }

  readLine(prompt) {
    if (this.disconnected) {
      return Promise.resolve({ type: "quit", key: "disconnect" });
    }
    this.ensureListening();
    if (prompt) process.stdout.write(prompt);
    if (this.waiter) {
      return Promise.reject(new Error("stdin busy"));
    }
    return new Promise((resolve, reject) => {
      this.waiter = { mode: "line", line: "", resolve, reject };
    });
  }

  readKeyPrompt(prompt) {
    if (prompt) process.stdout.write(prompt);
    return this.readKey().then((k) => {
      if (k.name === "disconnect" || k.name === "paused") {
        return { type: "quit", key: k.name };
      }
      if (k.name === "enter") return { type: "key", key: "enter" };
      if (isQuitKeyName(k.name)) return { type: "quit", key: k.name };
      if (k.name === "q") return { type: "quit", key: "q" };
      return { type: "key", key: k.name };
    });
  }
}

let hub = null;

export function getStdinHub() {
  if (!hub) hub = new StdinHub();
  return hub;
}

export function createKeyReader() {
  const h = getStdinHub();
  return {
    isTTY: h.isTTY,
    readKey: () => h.readKey(),
    close: () => {},
  };
}
