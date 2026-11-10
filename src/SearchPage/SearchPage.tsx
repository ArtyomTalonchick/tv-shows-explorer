import type { FC } from "react";
import { ResultsScreen } from "./ResultsScreen/ResultsScreen";
import { SearchHero } from "./SearchHero/SearchHero";
import { usePresenter } from "./usePresenter";

// Decides which screen to show: the start hero, or the results screen once there is a query.
export const SearchPage: FC = () => {
  const { isStart, query, shownQuery, status, shows, isLoading, changeQuery, clear, retry } = usePresenter();

  if (isStart) {
    return <SearchHero query={query} onQueryChange={changeQuery} />;
  }

  return (
    <ResultsScreen
      query={query}
      shownQuery={shownQuery}
      status={status}
      shows={shows}
      isLoading={isLoading}
      onQueryChange={changeQuery}
      onClear={clear}
      onRetry={retry}
    />
  );
};
