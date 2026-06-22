import { Idiomorph } from "idiomorph";

/** Päivitä elementin sisältö säilyttäen scroll, fokus ja tapahtumakuuntelijat kun mahdollista. */
export function patchInnerHtml(el: HTMLElement, html: string) {
  const trimmed = html.trim();
  if (!trimmed) {
    el.innerHTML = "";
    return;
  }
  if (!el.firstChild) {
    el.innerHTML = trimmed;
    return;
  }
  const scrollTop = el.scrollTop;
  const scrollLeft = el.scrollLeft;
  Idiomorph.morph(el, trimmed, { morphStyle: "innerHTML" });
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
