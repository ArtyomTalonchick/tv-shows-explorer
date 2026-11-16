// A show as the app uses it, mapped from a TVmaze search result.
export type Show = {
  id: number;
  name: string;
  genres: string[];
  rating: number | null;
  premiered: string | null;
  ended: string | null;
  image: string | null;
  // The show's page on TVmaze.
  url: string;
};

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
