import { chakra, Spinner } from "@chakra-ui/react";
import type { FC } from "react";
import { Icon } from "@/lib/components/Icon/Icon";
import { usePresenter, type SearchInputProps } from "./usePresenter";

export type { SearchInputProps } from "./usePresenter";

// .search-input of design/library: a pill with an icon, the field, and the clear button or the spinner.
// No submit button: the query is sent while typing.
export const SearchInput: FC<SearchInputProps> = (props) => {
  const { inputProps, sizeStyles, viewTransitionName, label, value, handleChange, onClear, isLoading, showClear } =
    usePresenter(props);

  return (
    <chakra.label
      display="flex"
      alignItems="center"
      gap="3"
      w="full"
      maxW="search"
      bg="bg.glass"
      borderWidth="1px"
      borderColor="border"
      rounded="full"
      color="fg.subtle"
      backdropFilter="blur({blurs.glass})"
      transition="border-color {durations.fast} {easings.standard}"
      viewTransitionName={viewTransitionName}
      _hover={{ borderColor: "fg.subtle" }}
      _focusWithin={{ borderColor: "accent.solid", color: "fg.muted" }}
      {...sizeStyles.root}
    >
      <Icon name="search" />
      <chakra.input
        flex="1"
        minW="0"
        bg="transparent"
        border="0"
        py="1"
        // As tall as the clear button: the field keeps its height with the button, the spinner or neither.
        minH="8"
        color="fg"
        fontWeight="medium"
        lineHeight="tight"
        outline="none"
        _placeholder={{ color: "fg.subtle" }}
        css={{ "&::-webkit-search-cancel-button": { display: "none" } }}
        {...sizeStyles.input}
        // After the styles, so a caller can change one; before the field's own props, so it cannot replace them.
        {...inputProps}
        type="search"
        aria-label={label}
        value={value}
        onChange={handleChange}
      />
      {isLoading && (
        <chakra.span display="flex" mx="2">
          <Spinner role="status" aria-label="Loading" />
        </chakra.span>
      )}
      {showClear && (
        <chakra.button
          type="button"
          aria-label="Clear search"
          onClick={onClear}
          display="grid"
          placeItems="center"
          boxSize="8"
          flex="none"
          rounded="full"
          bg="bg.muted"
          color="fg.muted"
          cursor="pointer"
          _hover={{ bg: "border", color: "fg" }}
        >
          <Icon name="close" boxSize="4" />
        </chakra.button>
      )}
    </chakra.label>
  );
};
