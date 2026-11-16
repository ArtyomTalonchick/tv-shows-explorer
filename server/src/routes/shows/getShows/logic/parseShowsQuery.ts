import type { ShowsQuery } from "@tv-shows-explorer/shared";

// A whole number from 1, written without a sign, a fraction or leading zeros.
const PAGE_PATTERN = /^[1-9]\d*$/;

// The search parameters of `GET /api/shows`, or `null` when they make no request: a missing or blank query, or a
// page that is not a whole number from 1. An empty genre counts as none.
export const parseShowsQuery = ({
    q = "",
    genre = "",
    page = "1",
}: Record<string, string | undefined>): ShowsQuery | null => {
    const query = q.trim();
    if (query === "" || !PAGE_PATTERN.test(page)) {
        return null;
    }

    return { query, genre: genre === "" ? null : genre, page: Number(page) };
};
