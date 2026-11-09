import { ResultsScreen } from "./ResultsScreen/ResultsScreen";
import { SearchHero } from "./SearchHero/SearchHero";
import { usePresenter } from "./usePresenter";

// Decides which screen to show: the start hero, or the results screen once there is a query.
export const SearchPage = () => {
  const { isStart, query, status, shows, isLoading, changeQuery, clear, retry } = usePresenter();

  if (isStart) {
    return <SearchHero query={query} onQueryChange={changeQuery} />;
  }

  return (
    <ResultsScreen
      query={query}
      status={status}
      shows={shows}
      isLoading={isLoading}
      onQueryChange={changeQuery}
      onClear={clear}
      onRetry={retry}
    />
  );
};
