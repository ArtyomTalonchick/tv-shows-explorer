// iOS does not draw the caret of a field that took the focus while a view transition was playing, until the next
// key. Setting the selection to where it already is makes it draw the caret; the value does not change.
export const redrawCaret = (): void => {
  const field = document.activeElement;
  if (!(field instanceof HTMLInputElement)) {
    return;
  }
  const end = field.value.length;
  field.setSelectionRange(end, end);
};
