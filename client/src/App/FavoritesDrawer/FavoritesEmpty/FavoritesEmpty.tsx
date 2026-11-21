import { Box } from "@chakra-ui/react";
import type { FC } from "react";
import { StateMessage } from "@/lib/ui-kit/StateMessage/StateMessage";

// No favourites yet: how to add one.
export const FavoritesEmpty: FC = () => {
    return (
        <Box flex="1" display="grid" m="3">
            <StateMessage
                icon="bookmark"
                title="No favourites yet"
                text="Tap the bookmark on a show to keep it here."
            />
        </Box>
    );
};
