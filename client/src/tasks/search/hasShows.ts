import type { ShowsPage } from "@tv-shows-explorer/shared";
import type { SearchAnswer } from "~/stores/useSearchStore";

// The answer holds found shows: not a failure, and the search found at least one.
export const hasShows = (answer: SearchAnswer | null): answer is SearchAnswer & { data: ShowsPage } => {
    return answer !== null && answer.data !== null && answer.data.found > 0;
};
