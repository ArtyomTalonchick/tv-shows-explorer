import { useState } from "react";

export type UseSearchQueryResult = {
  value: string;
  // Spaces around the query are not sent; a blank field counts as empty.
  trimmed: string;
  isEmpty: boolean;
  handleChange: (value: string) => void;
  clear: () => void;
};

// The state of the search field: what it holds and the query that goes to TVmaze.
export const useSearchQuery = (): UseSearchQueryResult => {
  const [value, setValue] = useState("");
  const trimmed = value.trim();

  return {
    value,
    trimmed,
    isEmpty: trimmed === "",
    handleChange: setValue,
    clear: () => setValue(""),
  };
};
