import { redrawCaret } from "../redrawCaret";

describe("redrawCaret", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("puts the selection at the end of the focused field and keeps its value", () => {
    const field = document.createElement("input");
    field.value = "dark";
    document.body.append(field);
    field.focus();
    field.setSelectionRange(0, 0);

    redrawCaret();

    expect(field.value).toBe("dark");
    expect([field.selectionStart, field.selectionEnd]).toEqual([4, 4]);
  });

  it("does nothing when no field is focused", () => {
    expect(() => redrawCaret()).not.toThrow();
  });
});
