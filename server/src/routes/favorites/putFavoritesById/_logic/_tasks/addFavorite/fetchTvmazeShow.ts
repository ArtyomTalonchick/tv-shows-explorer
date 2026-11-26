import { fetchJson, type Show } from "@tv-shows-explorer/shared";
import { TVMAZE_API } from "~/routes/constants";
import { tvmazeShowSchema } from "~/tasks/tvmaze/tvmazeShowSchema";
import { toShow } from "~/tasks/tvmaze/toShow";

// Asks TVmaze for one show by its id. Rejects with an `HttpError` of 404 when TVmaze has no such show, and on any
// other failure as `fetchJson` does, an answer that is not a show included.
export const fetchTvmazeShow = async (id: number, signal: AbortSignal): Promise<Show> => {
    const show = await fetchJson(`${TVMAZE_API}/shows/${id}`, tvmazeShowSchema, { signal });
    return toShow(show);
};
