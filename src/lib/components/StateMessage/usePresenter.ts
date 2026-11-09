import type { BoxProps } from "@chakra-ui/react";
import type { ReactNode } from "react";
import type { IconName } from "@/lib/components/Icon/Icon";

export type StateMessageProps = {
  icon: IconName;
  title: ReactNode;
  text: string;
  action?: ReactNode;
  tone?: "neutral" | "error";
};

type Tone = NonNullable<StateMessageProps["tone"]>;

// What changes between the tones: an error has a solid border and an accent icon.
const TONE_STYLES = {
  neutral: { borderStyle: "dashed", indicatorColor: "fg.muted" },
  error: { borderStyle: "solid", indicatorColor: "accent.fg" },
} satisfies Record<Tone, { borderStyle: BoxProps["borderStyle"]; indicatorColor: BoxProps["color"] }>;

export const usePresenter = ({ tone = "neutral", ...rest }: StateMessageProps) => {
  return {
    ...rest,
    ...TONE_STYLES[tone],
    // An error is announced to screen readers as soon as it appears.
    role: tone === "error" ? "alert" : undefined,
  };
};
