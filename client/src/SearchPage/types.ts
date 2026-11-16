import type { Show } from "@tv-shows-explorer/shared";

export type SearchStatus = "idle" | "loading" | "results" | "empty" | "error";

// What the results area shows for the query in the field.
export type SearchView = {
  status: SearchStatus;
  shows: Show[];
  // The query the shown answer belongs to; the query being loaded while there is none.
  shownQuery: string;
  // The request for the query as it is now has not answered yet.
  isLoading: boolean;
};
