import type { HTMLChakraProps } from "@chakra-ui/react";
import type { ChangeEvent, Ref } from "react";

// The props of the input itself (`placeholder`, `autoFocus`, `onFocus`, `ref`, `caretColor`…) go to it as they are.
// Taken over here: the value is a string, `onChange` gets it instead of the event, and `size` is the pill's size.
export type SearchInputProps = Omit<HTMLChakraProps<"input">, "value" | "onChange" | "size"> & {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  isLoading?: boolean;
  size?: "md" | "sm";
  // The accessible name: the field has no visible label.
  label: string;
  // Set on the pill, not on the input: lets the page move the field between two layouts with a view transition.
  viewTransitionName?: string;
  // Chakra's props leave out the ref; it goes to the input too.
  ref?: Ref<HTMLInputElement>;
};

type Size = NonNullable<SearchInputProps["size"]>;

type SizeStyles = { root: HTMLChakraProps<"label">; input: HTMLChakraProps<"input"> };

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
} satisfies Record<Size, SizeStyles>;

type UsePresenterResult = Pick<SearchInputProps, "value" | "onClear" | "label" | "viewTransitionName"> & {
  // The rest of the props, for the input.
  inputProps: HTMLChakraProps<"input"> & { ref?: Ref<HTMLInputElement> };
  sizeStyles: SizeStyles;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  // The spinner replaces the clear button while a request runs.
  showClear: boolean;
};

export const usePresenter = ({
  value,
  onChange,
  onClear,
  isLoading = false,
  size = "md",
  label,
  viewTransitionName,
  ...inputProps
}: SearchInputProps): UsePresenterResult => {
  return {
    inputProps,
    sizeStyles: SIZE_STYLES[size],
    viewTransitionName,
    label,
    value,
    handleChange: (event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value),
    onClear,
    isLoading,
    showClear: !isLoading && value !== "" && onClear !== undefined,
  };
};
