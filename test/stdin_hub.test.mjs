import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import { getStdinHub } from "../hosts/terminal/stdinHub.mjs";

// Korvaa process.stdin mockilla — hub on jo luotu, päivitä suoraan.
const hub = getStdinHub();
const mockStdin = new EventEmitter();
mockStdin.isTTY = true;
mockStdin.setRawMode = () => {};
mockStdin.resume = () => {};
mockStdin.pause = () => {};
mockStdin.setEncoding = () => {};
hub.stdin = mockStdin;
hub.listening = false;
hub.disconnected = false;
hub.buffer = "";
hub.waiter = null;

const pending = hub.readKey();
mockStdin.emit("error", Object.assign(new Error("read EIO"), { code: "EIO", syscall: "read" }));

const key = await pending;
assert.equal(key.name, "disconnect", "EIO → disconnect");
assert.equal(hub.disconnected, true, "merkitään katkenneeksi");

console.log("stdin_hub.test.mjs OK");
