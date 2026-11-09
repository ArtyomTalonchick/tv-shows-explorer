import { act, renderHook } from "@testing-library/react";
import { useSearchQuery } from "../useSearchQuery";

describe("useSearchQuery", () => {
  it("starts empty", () => {
    const { result } = renderHook(() => useSearchQuery());

    expect(result.current).toMatchObject({ value: "", trimmed: "", isEmpty: true });
  });

  it("keeps what the user typed and trims the query", () => {
    const { result } = renderHook(() => useSearchQuery());

    act(() => result.current.handleChange("  dark "));

    expect(result.current).toMatchObject({ value: "  dark ", trimmed: "dark", isEmpty: false });
  });

  it("treats a blank field as empty", () => {
    const { result } = renderHook(() => useSearchQuery());

    act(() => result.current.handleChange("   "));

    expect(result.current).toMatchObject({ value: "   ", trimmed: "", isEmpty: true });
  });

  it("clears the field", () => {
    const { result } = renderHook(() => useSearchQuery());
    act(() => result.current.handleChange("dark"));

    act(() => result.current.clear());

    expect(result.current).toMatchObject({ value: "", isEmpty: true });
  });
});
