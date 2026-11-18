import { useSearchQuery } from "@/App/SearchPage/_logic/useSearchQuery";

export type ResultsEmptyProps = {
    query: string;
};

type UsePresenterResult = ResultsEmptyProps & {
    // «Clear search»: empties the field and gives it the focus back, as the × button does.
    onClear: () => void;
};

export const usePresenter = ({ query }: ResultsEmptyProps): UsePresenterResult => {
    const { clear } = useSearchQuery();

    return { query, onClear: clear };
};
