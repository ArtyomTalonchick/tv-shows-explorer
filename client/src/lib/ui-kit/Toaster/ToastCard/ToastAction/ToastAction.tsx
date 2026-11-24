import { Toast } from "@chakra-ui/react";
import type { FC } from "react";

export type ToastActionProps = Toast.ActionTriggerProps;

// .toast__action of design/library: the action at the end of a toast, bold accent text that a press also uses to
// close the toast. A button, or with `asChild` the link it wraps.
export const ToastAction: FC<ToastActionProps> = (props) => {
    return (
        <Toast.ActionTrigger
            flex="none"
            ml="2"
            h="auto"
            px="2"
            py="1"
            border="0"
            rounded="sm"
            bg="transparent"
            color="accent.fg"
            fontSize="sm"
            fontWeight="bold"
            textDecoration="none"
            cursor="pointer"
            transition="background {durations.fast} {easings.standard}"
            _hover={{ bg: "border" }}
            {...props}
        />
    );
};
