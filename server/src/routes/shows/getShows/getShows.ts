import type { Handler } from "hono";
import { getShowsPage } from "./logic/getShowsPage";
import { parseShowsQuery } from "./logic/parseShowsQuery";
import { searchTvmaze } from "./logic/tasks/searchTvmaze";

// `GET /api/shows?q=<query>&genre=<genre>&page=<page>`: searches TVmaze and answers one page of the found shows of
// the genre (`ShowsPage`). A request the client drops cancels the TVmaze request too.
export const getShows: Handler = async (context) => {
  const query = parseShowsQuery(context.req.query());
  if (query === null) {
    return context.json({ error: "Expected a query in q and a page from 1" }, 400);
  }

  try {
    const found = await searchTvmaze(query.query, context.req.raw.signal);
    return context.json(getShowsPage(found, query));
  } catch {
    return context.json({ error: "TVmaze did not answer" }, 502);
  }
};
