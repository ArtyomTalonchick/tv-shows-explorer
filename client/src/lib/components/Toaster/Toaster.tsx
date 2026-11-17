import { Portal, Toaster as ChakraToaster } from "@chakra-ui/react";
import type { FC } from "react";
import { toaster } from "@/lib/toast/toaster";
import { ToastCard } from "./ToastCard/ToastCard";

// .toast-region of design/library: the toasts of `showToast`, at the bottom centre above everything, the drawer too.
export const Toaster: FC = () => {
    return (
        <Portal>
            <ChakraToaster toaster={toaster} insetInline={{ mdDown: "4" }} zIndex="toast">
                {(toast) => <ToastCard toast={toast} />}
            </ChakraToaster>
        </Portal>
    );
};
