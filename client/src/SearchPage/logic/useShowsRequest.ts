import { useRequest } from "@/lib/request/useRequest";
import type { ShowsQuery } from "@tv-shows-explorer/shared";
import type { SearchView } from "./types";
import { getSearchView } from "./getSearchView";
import { searchShows } from "./tasks/searchShows";

export type UseShowsRequestResult = SearchView & {
    retry: () => void;
};

// The server request for `params`: cancelled by the next one, repeated by Retry. `query` is the trimmed field, which
// `params` follow once typing stops.
export const useShowsRequest = (query: string, params: ShowsQuery | null): UseShowsRequestResult => {
    const { latest, current, retry, reset } = useRequest(searchShows, params);

    // An emptied field drops the answer, so the next query starts from the skeletons again.
    if (query === "" && latest !== null) {
        reset();
    }

    return { ...getSearchView({ query, params, current, latest }), retry };
};
