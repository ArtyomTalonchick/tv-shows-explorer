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

type ToneStyles = { borderStyle: BoxProps["borderStyle"]; indicatorColor: BoxProps["color"] };

// What changes between the tones: an error has a solid border and an accent icon.
const TONE_STYLES = {
  neutral: { borderStyle: "dashed", indicatorColor: "fg.muted" },
  error: { borderStyle: "solid", indicatorColor: "accent.fg" },
} satisfies Record<Tone, ToneStyles>;

type UsePresenterResult = Omit<StateMessageProps, "tone"> &
  ToneStyles & {
    // An error is announced to screen readers as soon as it appears.
    role: "alert" | undefined;
  };

export const usePresenter = ({ tone = "neutral", ...rest }: StateMessageProps): UsePresenterResult => {
  return {
    ...rest,
    ...TONE_STYLES[tone],
    role: tone === "error" ? "alert" : undefined,
  };
};
