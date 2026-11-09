import { useSlotRecipe } from "@chakra-ui/react";
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
  const recipe = useSlotRecipe({ key: "searchInput" });
  const styles = recipe({ size });

  return {
    styles,
    rootCss: { ...styles.root, viewTransitionName },
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
