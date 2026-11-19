import { act, renderHook } from "@testing-library/react";
import { SEARCH_FIELD_ID } from "@/App/SearchPage/constants";
import { useQueryStore } from "../../_stores/useQueryStore";
import { useSearchQuery } from "../useSearchQuery";

describe("useSearchQuery", () => {
    beforeEach(() => {
        useQueryStore.setState({ value: "" });
    });

    afterEach(() => {
        document.body.innerHTML = "";
    });

    it("starts empty", () => {
        const { result } = renderHook(() => useSearchQuery());

        expect(result.current).toMatchObject({ value: "", trimmed: "" });
    });

    it("keeps what the user typed and trims the query", () => {
        const { result } = renderHook(() => useSearchQuery());

        act(() => result.current.handleChange("  dark "));

        expect(result.current).toMatchObject({ value: "  dark ", trimmed: "dark" });
    });

    it("treats a blank field as empty", () => {
        const { result } = renderHook(() => useSearchQuery());

        act(() => result.current.handleChange("   "));

        expect(result.current).toMatchObject({ value: "   ", trimmed: "" });
    });

    it("clears the field and gives it the focus back", () => {
        const field = document.createElement("input");
        field.id = SEARCH_FIELD_ID;
        document.body.append(field);
        const { result } = renderHook(() => useSearchQuery());
        act(() => result.current.handleChange("dark"));

        act(() => result.current.clear());

        expect(result.current).toMatchObject({ value: "" });
        expect(document.activeElement).toBe(field);
    });

    it("is one field for every unit that reads it", () => {
        const hero = renderHook(() => useSearchQuery());
        const bar = renderHook(() => useSearchQuery());

        act(() => hero.result.current.handleChange("dark"));

        expect(bar.result.current.value).toBe("dark");
    });
});
