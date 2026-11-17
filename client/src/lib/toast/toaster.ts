import { createToaster } from "@chakra-ui/react";
import { system } from "@/lib/theme/system";

// The one toaster of the app: <Toaster /> shows what `showToast` puts in it, at the bottom centre, for
// durations.toast each.
export const toaster = createToaster({
    placement: "bottom",
    // spacing.6 from the bottom edge, as .toast-region.
    offsets: system.token("spacing.6"),
    duration: Number.parseInt(system.token("durations.toast"), 10),
    max: 3,
});
