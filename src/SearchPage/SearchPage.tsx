import type { FC } from "react";
import { ResultsScreen } from "./ResultsScreen/ResultsScreen";
import { SearchHero } from "./SearchHero/SearchHero";
import { usePresenter } from "./usePresenter";

// Decides which screen to show: the start hero, or the results screen once the field was focused.
export const SearchPage: FC = () => {
  const { isStart, hero, results } = usePresenter();

  if (isStart) {
    return <SearchHero {...hero} />;
  }

  return <ResultsScreen {...results} />;
};
