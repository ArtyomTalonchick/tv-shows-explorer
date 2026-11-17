import type { Show } from "@tv-shows-explorer/shared";
import { TVMAZE_API } from "@/routes/_logic/constants";
import { toShow } from "@/routes/_logic/_tasks/toShow";
import { fetchJson } from "@/lib/http/fetchJson";
import type { TvmazeShow } from "@/routes/_logic/types";

// Asks TVmaze for one show by its id. Rejects with an `HttpError` of 404 when TVmaze has no such show, and on any
// other failure as `fetchJson` does.
export const fetchTvmazeShow = async (id: number, signal: AbortSignal): Promise<Show> => {
    const show = await fetchJson<TvmazeShow>(`${TVMAZE_API}/shows/${id}`, signal);
    return toShow(show);
};
