import { defineTextStyles } from "@chakra-ui/react";

// The text classes of design/library: .eyebrow, .display, .title, .lead, .logo.
export const textStyles = defineTextStyles({
  eyebrow: {
    value: {
      fontSize: "xs",
      fontWeight: "semibold",
      letterSpacing: "eyebrow",
      textTransform: "uppercase",
      color: "accent.fg",
    },
  },
  display: {
    value: {
      fontFamily: "heading",
      fontSize: "display",
      lineHeight: "display",
      fontWeight: "black",
      letterSpacing: "display",
    },
  },
  title: {
    value: {
      fontSize: "3xl",
      fontWeight: "extrabold",
      letterSpacing: "tight",
      lineHeight: "tight",
    },
  },
  lead: {
    value: {
      color: "fg.muted",
      fontSize: "xl",
      lineHeight: "normal",
    },
  },
  logo: {
    value: {
      fontWeight: "black",
      letterSpacing: "tight",
      fontSize: "xl",
      color: "fg",
      whiteSpace: "nowrap",
    },
  },
});
