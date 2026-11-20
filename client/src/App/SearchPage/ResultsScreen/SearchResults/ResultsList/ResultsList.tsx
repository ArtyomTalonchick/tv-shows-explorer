import { Box } from "@chakra-ui/react";
import type { FC } from "react";
import { Pagination } from "@/lib/components/Pagination/Pagination";
import { ShowCard } from "./ShowCard/ShowCard";
import { usePresenter } from "./_logic/usePresenter";

// Results: one page of show cards, three in a row (one column of rows on mobile), and the pages below.
export const ResultsList: FC = () => {
    const { gridRef, shows, pagination } = usePresenter();

    return (
        <Box>
            <Box
                ref={gridRef}
                as="ul"
                listStyle="none"
                display="grid"
                gridTemplateColumns={{ base: "minmax(0, 1fr)", md: "repeat(3, minmax(0, 1fr))" }}
                gap="8"
                mb="12"
            >
                {shows.map((show) => (
                    <li key={show.id}>
                        <ShowCard show={show} />
                    </li>
                ))}
            </Box>
            {pagination && <Pagination {...pagination} />}
        </Box>
    );
};
