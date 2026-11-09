import { chakra, Spinner } from "@chakra-ui/react";
import { Icon } from "@/lib/components/Icon/Icon";
import { usePresenter, type SearchInputProps } from "./usePresenter";

export type { SearchInputProps } from "./usePresenter";

// The search field of design/library; the styles are the `searchInput` slot recipe of the theme.
// No submit button: the query is sent while typing.
export const SearchInput = (props: SearchInputProps) => {
  const { styles, rootCss, label, placeholder, autoFocus, value, handleChange, onClear, isLoading, showClear } =
    usePresenter(props);

  return (
    <chakra.label css={rootCss}>
      <Icon name="search" />
      <chakra.input
        type="search"
        aria-label={label}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        autoFocus={autoFocus}
        css={styles.input}
      />
      {isLoading && (
        <chakra.span css={styles.spinner}>
          <Spinner role="status" aria-label="Loading" />
        </chakra.span>
      )}
      {showClear && (
        <chakra.button type="button" aria-label="Clear search" onClick={onClear} css={styles.clear}>
          <Icon name="close" />
        </chakra.button>
      )}
    </chakra.label>
  );
};
