// A show as the app uses it, mapped from a TVmaze search result.
export type Show = {
  id: number;
  name: string;
  genres: string[];
  rating: number | null;
  premiered: string | null;
  ended: string | null;
  image: string | null;
};

export type SearchStatus = "idle" | "loading" | "results" | "empty" | "error";
