import { useSearchQuery } from "@/SearchPage/_logic/useSearchQuery";
import type { UseShowsParamsResult } from "./useShowsParams";
import type { UseShowsRequestResult } from "./useShowsRequest/useShowsRequest";
import { useDebouncedQuery } from "./useDebouncedQuery";
import { useShowsParams } from "./useShowsParams";
import { useShowsRequest } from "./useShowsRequest/useShowsRequest";

export type UseShowsSearchResult = UseShowsRequestResult & Omit<UseShowsParamsResult, "params">;

// The search the results show: the field from the store, its query once typing stops, the genre and the page chosen
// for it, and the request. The results screen is its only user, so they stay hooks here rather than in a store.
export const useShowsSearch = (): UseShowsSearchResult => {
    const { trimmed } = useSearchQuery();
    const debounced = useDebouncedQuery(trimmed);
    const { params, selectGenre, changePage } = useShowsParams(debounced);
    const request = useShowsRequest(trimmed, params);

    return { ...request, selectGenre, changePage };
};
