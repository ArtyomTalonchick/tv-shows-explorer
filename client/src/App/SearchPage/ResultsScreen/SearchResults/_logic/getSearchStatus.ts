import type { SearchAnswer } from "@/stores/useSearchStore";

export type SearchStatus = "idle" | "loading" | "results" | "empty" | "error";

// What the results area shows: nothing for an empty field, the loading state until an answer is on screen, then the
// answer — found shows, nothing found, or a failure.
export const getSearchStatus = (value: string, answer: SearchAnswer | null): SearchStatus => {
    if (value.trim() === "") {
        return "idle";
    }
    if (answer === null) {
        return "loading";
    }
    if (answer.data === null) {
        return "error";
    }
    return answer.data.found > 0 ? "results" : "empty";
};
