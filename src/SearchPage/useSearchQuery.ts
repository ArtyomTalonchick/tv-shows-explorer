import { useState } from "react";

// The state of the search field: what it holds and the query that goes to TVmaze.
export const useSearchQuery = () => {
  const [value, setValue] = useState("");
  const trimmed = value.trim();

  return {
    value,
    // Spaces around the query are not sent; a blank field counts as empty.
    trimmed,
    isEmpty: trimmed === "",
    handleChange: setValue,
    clear: () => setValue(""),
  };
};
