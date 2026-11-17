import type { GenreFilterProps } from "../GenreFilter/GenreFilter";
import type { ResultsEmptyProps } from "../ResultsEmpty/ResultsEmpty";
import type { ResultsErrorProps } from "../ResultsError/ResultsError";
import type { ResultsHeadProps } from "../ResultsHead/ResultsHead";
import type { ResultsListProps } from "../ResultsList/ResultsList";
import { useShowsSearch } from "./useShowsSearch";

type UsePresenterResult = {
    // «Shows for “dark”» with «9 shows», or «4 of 9 shows · Drama» for a genre; hidden with an empty field.
    head: ResultsHeadProps | null;
    // Hidden when no found show has a genre.
    genreFilter: GenreFilterProps | null;
    list: ResultsListProps | null;
    // The shown results wait for the next answer: dimmed, and nothing in them can be pressed.
    isBusy: boolean;
    isIdle: boolean;
    isLoading: boolean;
    empty: ResultsEmptyProps | null;
    error: ResultsErrorProps | null;
};

export const usePresenter = (): UsePresenterResult => {
    const { status, result, genre, page, shownQuery, isLoading, retry, selectGenre, changePage } = useShowsSearch();
    const shown = status === "results" ? result : null;
    const query = shownQuery.trim();

    const countLabel = ((): string | null => {
        if (status === "empty") {
            return "0 shows";
        }
        if (shown === null) {
            return null;
        }
        const all = `${shown.found} ${shown.found === 1 ? "show" : "shows"}`;
        if (shown.genre === null) {
            return all;
        }
        return `${shown.total} of ${all} · ${shown.genre}`;
    })();

    const genreFilter: GenreFilterProps | null =
        shown !== null && shown.genres.length > 0
            ? { genres: shown.genres, total: shown.found, selected: genre, onSelect: selectGenre }
            : null;
    const list: ResultsListProps | null =
        shown === null
            ? null
            : { shows: shown.shows, page, perPage: shown.perPage, total: shown.total, onPageChange: changePage };

    return {
        head: status === "idle" ? null : { query, count: countLabel },
        genreFilter,
        list,
        isBusy: shown !== null && isLoading,
        isIdle: status === "idle",
        isLoading: status === "loading",
        empty: status === "empty" ? { query } : null,
        error: status === "error" ? { onRetry: retry } : null,
    };
};
