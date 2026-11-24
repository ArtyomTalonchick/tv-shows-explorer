import { Link } from "@chakra-ui/react";
import type { FC } from "react";
import { Link as RouterLink } from "react-router";

export type EmailErrorProps = {
    // The email already has an account: the error offers the way to sign in.
    isTaken: boolean;
    // The error of a wrong value, when the email is not taken.
    message: string;
};

// The error under the email field of the sign-up form.
export const EmailError: FC<EmailErrorProps> = ({ isTaken, message }) => {
    if (isTaken) {
        return (
            <>
                This email already has an account.{" "}
                <Link asChild variant="accent">
                    <RouterLink to="/sign-in">Sign in instead</RouterLink>
                </Link>
            </>
        );
    }
    return <>{message}</>;
};
