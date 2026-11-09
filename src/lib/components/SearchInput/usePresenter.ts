import type { HTMLChakraProps } from "@chakra-ui/react";
import type { ChangeEvent } from "react";

export type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  isLoading?: boolean;
  size?: "md" | "sm";
  autoFocus?: boolean;
  label: string;
  placeholder: string;
  // Lets the page move the field between two layouts with a view transition.
  viewTransitionName?: string;
};

type Size = NonNullable<SearchInputProps["size"]>;

// What changes between the sizes of the field: the padding of the pill and the size of the text.
const SIZE_STYLES = {
  md: {
    root: { py: "3", ps: "6", pe: "3" },
    input: { fontSize: "lg" },
  },
  sm: {
    root: { py: "2", ps: "4", pe: "2" },
    input: { fontSize: "md" },
  },
} satisfies Record<Size, { root: HTMLChakraProps<"label">; input: HTMLChakraProps<"input"> }>;

export const usePresenter = ({
  value,
  onChange,
  onClear,
  isLoading = false,
  size = "md",
  label,
  placeholder,
  viewTransitionName,
  autoFocus,
}: SearchInputProps) => {
  return {
    sizeStyles: SIZE_STYLES[size],
    viewTransitionName,
    label,
    placeholder,
    autoFocus,
    value,
    handleChange: (event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value),
    onClear,
    isLoading,
    // The spinner replaces the clear button while a request runs.
    showClear: !isLoading && value !== "" && onClear !== undefined,
  };
};
