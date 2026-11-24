import { Box, Button, Link, Text } from "@chakra-ui/react";
import type { FC } from "react";
import { Link as RouterLink } from "react-router";
import { StateMessage } from "~/lib/ui-kit/StateMessage/StateMessage";
import { usePresenter } from "./_logic/usePresenter";

// A guest has no list: what favourites need, «Sign in» and the way to sign up. Both lead off the page and close the
// drawer.
export const FavoritesGuest: FC = () => {
    const { close } = usePresenter();

    return (
        <Box flex="1" display="grid" m="3">
            <StateMessage
                icon="bookmark"
                title="Sign in to keep favourites"
                text="Your list is kept with your account, on every device."
                action={
                    <Box display="grid" justifyItems="center" gap="3">
                        <Button asChild size="sm">
                            <RouterLink to="/sign-in" onClick={close}>
                                Sign in
                            </RouterLink>
                        </Button>
                        <Text color="fg.muted">
                            No account yet?{" "}
                            <Link asChild variant="accent">
                                <RouterLink to="/sign-up" onClick={close}>
                                    Sign up
                                </RouterLink>
                            </Link>
                        </Text>
                    </Box>
                }
            />
        </Box>
    );
};
