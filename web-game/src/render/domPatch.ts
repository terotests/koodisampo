/** Päivitä sisältö säilyttäen scroll-sijainti (ei ulkoista morph-kirjastoa). */
export function patchInnerHtml(el: HTMLElement, html: string) {
  const trimmed = html.trim();
  const scrollTop = el.scrollTop;
  const scrollLeft = el.scrollLeft;
  if (!trimmed) {
    el.innerHTML = "";
    return;
  }
  el.innerHTML = trimmed;
  if (el.scrollHeight > el.clientHeight) {
    el.scrollTop = scrollTop;
  }
  if (el.scrollWidth > el.clientWidth) {
    el.scrollLeft = scrollLeft;
  }
}

export function ensureChild(
  parent: HTMLElement,
  selector: string,
  create: () => HTMLElement,
): HTMLElement {
  let el = parent.querySelector<HTMLElement>(selector);
  if (!el) {
    el = create();
    parent.appendChild(el);
  }
  return el;
}

export function setText(el: HTMLElement | null, text: string) {
  if (!el) return;
  if (el.textContent !== text) {
    el.textContent = text;
  }
}
