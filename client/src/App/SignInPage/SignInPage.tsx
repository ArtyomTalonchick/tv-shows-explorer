import { Button, chakra } from "@chakra-ui/react";
import type { FC } from "react";
import { AuthPage } from "~/App/_components/AuthPage/AuthPage";
import { Field } from "~/lib/ui-kit/Field/Field";
import { FormAlert } from "~/lib/ui-kit/FormAlert/FormAlert";
import { PasswordField } from "~/lib/ui-kit/PasswordField/PasswordField";
import { usePresenter } from "./_logic/usePresenter";

// The sign-in page at /sign-in: .auth-card__form of design/v0.3 with the alert of the last request, the fields and
// «Sign in».
export const SignInPage: FC = () => {
    const { alert, email, password, isLoading, handleSubmit } = usePresenter();

    return (
        <AuthPage
            eyebrow="Welcome back"
            title="Sign in"
            text="Your favourites are kept with your account."
            footer={{ text: "No account yet?", link: "Sign up", to: "/sign-up" }}
        >
            <chakra.form display="grid" gap="6" noValidate onSubmit={handleSubmit}>
                {alert && <FormAlert>{alert}</FormAlert>}
                <Field {...email} />
                <PasswordField {...password} />
                <Button type="submit" size="md" w="full" loading={isLoading} loadingText="Signing in…">
                    Sign in
                </Button>
            </chakra.form>
        </AuthPage>
    );
};
