import { Box } from "@chakra-ui/react";
import { Chip } from "@/lib/components/Chip/Chip";
import { usePresenter, type GenreFilterProps } from "./usePresenter";

export type { GenreFilterProps } from "./usePresenter";

// The genre chips above the list: «All», then the genres of the results. They wrap on wide screens and scroll
// in one row, edge to edge, on mobile.
export const GenreFilter = (props: GenreFilterProps) => {
  const { chips } = usePresenter(props);

  return (
    <Box
      role="group"
      aria-label="Genre"
      display="flex"
      flexWrap={{ base: "nowrap", md: "wrap" }}
      gap="2"
      overflowX={{ base: "auto", md: "visible" }}
      scrollbar="hidden"
      mx={{ base: "-4", md: "0" }}
      px={{ base: "4", md: "0" }}
      mb={{ base: "8", md: "10" }}
    >
      {chips.map((chip) => (
        <Chip key={chip.key} {...chip.props} />
      ))}
    </Box>
  );
};
