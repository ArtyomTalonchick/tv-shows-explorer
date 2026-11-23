import type { FC } from "react";
import { AuthPage } from "~/App/_components/AuthPage/AuthPage";

// The sign-in page at /sign-in.
export const SignInPage: FC = () => {
    return (
        <AuthPage
            eyebrow="Welcome back"
            title="Sign in"
            text="Your favourites are kept with your account."
            footer={{ text: "No account yet?", link: "Sign up", to: "/sign-up" }}
        />
    );
};
