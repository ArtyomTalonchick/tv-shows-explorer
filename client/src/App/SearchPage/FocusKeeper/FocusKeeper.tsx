import { chakra } from "@chakra-ui/react";
import type { FC } from "react";
import { FOCUS_KEEPER_ID } from "@/App/SearchPage/constants";

// An invisible field that holds the focus from a tap on the hero field until the keyboard is open. iOS opens the
// keyboard a moment after the tap, and only if the field focused in the tap still has the focus then; the hero field
// goes away with the swap, so the tap focuses this one, and the swap waits for the keyboard. The results field then
// takes the focus from here, and focus moved from one field to another keeps the keyboard open. It stays mounted on
// both screens. The font is 16px, so iOS does not zoom to it.
export const FocusKeeper: FC = () => {
    return (
        <chakra.input
            id={FOCUS_KEEPER_ID}
            type="text"
            tabIndex={-1}
            aria-hidden="true"
            position="fixed"
            top="0"
            left="0"
            w="1px"
            h="1px"
            p="0"
            border="0"
            opacity="0"
            fontSize="16px"
            caretColor="transparent"
            pointerEvents="none"
        />
    );
};
