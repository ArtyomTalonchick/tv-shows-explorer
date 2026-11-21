import { renderHook } from "@testing-library/react";
import type { ShowsPage } from "@tv-shows-explorer/shared";
import { useSearchStore } from "~/stores/useSearchStore";
import { clearSearch } from "~/tasks/search/clearSearch";
import { usePresenter } from "../usePresenter";

const pageOf = (found: number, genres = [{ genre: "Drama", count: found }]): ShowsPage => ({
    shows: [],
    genres,
    found,
    genre: null,
    total: found,
    page: 1,
    perPage: 3,
});

const FOUND = { query: "dark", data: pageOf(3), failed: false };

describe("SearchResults usePresenter", () => {
    beforeEach(() => {
        clearSearch();
    });

    it("shows only the idle message for an empty field", () => {
        const { result } = renderHook(() => usePresenter());

        expect(result.current).toMatchObject({ isIdle: true, hasHead: false, hasList: false, isBusy: false });
    });

    it("shows the heading, the chips and the list of the found shows", () => {
        useSearchStore.setState({ value: "dark", query: "dark", answer: FOUND });

        const { result } = renderHook(() => usePresenter());

        expect(result.current).toMatchObject({ hasHead: true, hasGenres: true, hasList: true, isBusy: false });
    });

    it("hides the chips when no found show has a genre", () => {
        useSearchStore.setState({ value: "dark", query: "dark", answer: { ...FOUND, data: pageOf(3, []) } });

        const { result } = renderHook(() => usePresenter());

        expect(result.current).toMatchObject({ hasGenres: false, hasList: true });
    });

    it.each([
        ["typing has not stopped", { value: "dark s" }],
        ["the request is on its way", { isLoading: true }],
    ])("keeps the found shows busy while %s", (_, state) => {
        useSearchStore.setState({ value: "dark", query: "dark", answer: FOUND, ...state });

        const { result } = renderHook(() => usePresenter());

        expect(result.current).toMatchObject({ hasList: true, isBusy: true });
    });

    it("shows the loading, empty and error states with the heading", () => {
        useSearchStore.setState({ value: "dark", query: "dark", isLoading: true });
        expect(renderHook(() => usePresenter()).result.current).toMatchObject({ isLoading: true, hasHead: true });

        useSearchStore.setState({ isLoading: false, answer: { ...FOUND, data: pageOf(0) } });
        expect(renderHook(() => usePresenter()).result.current).toMatchObject({ isEmpty: true, hasList: false });

        useSearchStore.setState({ answer: { query: "dark", data: null, failed: true } });
        expect(renderHook(() => usePresenter()).result.current).toMatchObject({ isError: true, hasList: false });
    });
});
