import { loadShows } from "@/tasks/search/loadShows";

type UsePresenterResult = {
    // Sends the current query again.
    onRetry: () => void;
};

export const usePresenter = (): UsePresenterResult => {
    const handleRetry = () => void loadShows();

    return { onRetry: handleRetry };
};
