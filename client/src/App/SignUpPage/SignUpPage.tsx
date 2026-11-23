import type { FC } from "react";
import { AuthPage } from "~/App/_components/AuthPage/AuthPage";

// The sign-up page at /sign-up.
export const SignUpPage: FC = () => {
    return (
        <AuthPage
            eyebrow="New here"
            title="Create an account"
            text="Keep your favourites on every device."
            footer={{ text: "Have an account?", link: "Sign in", to: "/sign-in" }}
        />
    );
};
