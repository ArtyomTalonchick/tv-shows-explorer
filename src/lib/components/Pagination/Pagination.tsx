import { Box, Text } from "@chakra-ui/react";
import type { FC } from "react";
import { Icon } from "@/lib/components/Icon/Icon";
import { PageButton } from "./PageButton/PageButton";
import { usePresenter, type PaginationProps } from "./usePresenter";

export type { PaginationProps } from "./usePresenter";

// Pagination of design/library: ‹ 1 2 3 › and «Shows 1–3 of 9».
export const Pagination: FC<PaginationProps> = (props) => {
  const { pages, isFirst, isLast, info, goTo, goBack, goNext } = usePresenter(props);

  return (
    <Box as="nav" aria-label="Pages">
      <Box display="flex" alignItems="center" justifyContent="center" gap="2">
        <PageButton label="Previous page" disabled={isFirst} onClick={goBack}>
          <Icon name="chevron-left" />
        </PageButton>
        {pages.map((page) => (
          <PageButton key={page.number} isCurrent={page.isCurrent} onClick={() => goTo(page.number)}>
            {page.number}
          </PageButton>
        ))}
        <PageButton label="Next page" disabled={isLast} onClick={goNext}>
          <Icon name="chevron-right" />
        </PageButton>
      </Box>
      <Text mt="3" color="fg.subtle" fontSize="sm" textAlign="center">
        {info}
      </Text>
    </Box>
  );
};
