import type { FC } from "react";
import { Pagination } from "~/lib/ui-kit/Pagination/Pagination";
import { usePresenter } from "./_logic/usePresenter";

// The pages below the show cards, hidden when every show fits on one page.
export const ResultsListPagination: FC = () => {
    const pagination = usePresenter();

    return pagination && <Pagination {...pagination} />;
};
