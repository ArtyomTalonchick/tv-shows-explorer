import { useSlotRecipe } from "@chakra-ui/react";
import type { ReactNode } from "react";
import type { IconName } from "@/lib/components/Icon/Icon";

export type StateMessageProps = {
  icon: IconName;
  title: ReactNode;
  text: string;
  action?: ReactNode;
  tone?: "neutral" | "error";
};

export const usePresenter = ({ tone = "neutral", ...rest }: StateMessageProps) => {
  const recipe = useSlotRecipe({ key: "stateMessage" });

  return {
    ...rest,
    styles: recipe({ tone }),
    // An error is announced to screen readers as soon as it appears.
    role: tone === "error" ? "alert" : undefined,
  };
};
