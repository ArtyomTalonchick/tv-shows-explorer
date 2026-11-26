import { showsQuerySchema } from "@tv-shows-explorer/shared";
import { withValid } from "~/lib/validation/withValid";
import { getShowsPage } from "./_logic/getShowsPage/getShowsPage";
import { searchTvmaze } from "./_logic/_tasks/searchTvmaze/searchTvmaze";

// `GET /api/shows?q=<query>&genre=<genre>&page=<page>`: searches TVmaze and answers one page of the found shows of
// the genre (`ShowsPage`). 400 when the query is not a `showsQuerySchema`. A request the client drops cancels the
// TVmaze request too.
export const getShows = withValid({ query: showsQuerySchema }, async (context, { query }) => {
    try {
        const found = await searchTvmaze(query.query, context.req.raw.signal);
        return context.json(getShowsPage(found, query));
    } catch {
        return context.json({ error: "TVmaze did not answer" }, 502);
    }
});
