import { Button } from "@chakra-ui/react";
import type { FC } from "react";
import { Link as RouterLink } from "react-router";
import { Icon } from "~/lib/ui-kit/Icon/Icon";

// The guest's «Sign in» in the header, a glass button that leads to the sign-in page. On a phone it drops its icon,
// so the logo, the favourites and the link fit on one row.
export const SignInLink: FC = () => {
    return (
        <Button asChild variant="glass" size="sm" flex="none">
            <RouterLink to="/sign-in">
                <Icon name="user" hideBelow="md" />
                Sign in
            </RouterLink>
        </Button>
    );
};
