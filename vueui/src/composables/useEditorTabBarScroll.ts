/** Persists open-nodes tab bar horizontal scroll across editor view route changes. */
let persistedScrollLeft = 0;

export function saveEditorTabBarScrollLeft(left: number) {
  persistedScrollLeft = Math.max(0, left);
}

export function getEditorTabBarScrollLeft(): number {
  return persistedScrollLeft;
}

export function restoreEditorTabBarScroll(el: HTMLElement | null) {
  if (!el) return;
  el.scrollLeft = persistedScrollLeft;
}
