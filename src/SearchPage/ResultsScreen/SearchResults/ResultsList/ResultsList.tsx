import { Box } from "@chakra-ui/react";
import { Pagination } from "@/lib/components/Pagination/Pagination";
import { ShowCard } from "@/lib/components/ShowCard/ShowCard";
import { usePresenter, type ResultsListProps } from "./usePresenter";

export type { ResultsListProps } from "./usePresenter";

// Results: one page of show cards, three in a row (one column of rows on mobile), and the pages below.
export const ResultsList = (props: ResultsListProps) => {
  const { gridRef, cards, pagination } = usePresenter(props);

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
        {cards.map((card) => (
          <li key={card.id}>
            <ShowCard {...card.props} />
          </li>
        ))}
      </Box>
      {pagination && <Pagination {...pagination} />}
    </Box>
  );
};
