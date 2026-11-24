import { Button, chakra } from "@chakra-ui/react";
import type { FC } from "react";
import { AuthPage } from "~/App/_components/AuthPage/AuthPage";
import { Field } from "~/lib/ui-kit/Field/Field";
import { FormAlert } from "~/lib/ui-kit/FormAlert/FormAlert";
import { PasswordField } from "~/lib/ui-kit/PasswordField/PasswordField";
import { EmailError } from "./EmailError/EmailError";
import { usePresenter } from "./_logic/usePresenter";

// The sign-up page at /sign-up: .auth-card__form of design/v0.3 with the alert of the last request, the fields and
// «Create account».
export const SignUpPage: FC = () => {
    const { alert, email, emailError, password, isLoading, handleSubmit } = usePresenter();

    return (
        <AuthPage
            eyebrow="New here"
            title="Create an account"
            text="Keep your favourites on every device."
            footer={{ text: "Have an account?", link: "Sign in", to: "/sign-in" }}
        >
            <chakra.form display="grid" gap="6" noValidate onSubmit={handleSubmit}>
                {alert && <FormAlert>{alert}</FormAlert>}
                <Field {...email} error={emailError && <EmailError {...emailError} />} />
                <PasswordField {...password} />
                <Button type="submit" size="md" w="full" loading={isLoading} loadingText="Creating account…">
                    Create account
                </Button>
            </chakra.form>
        </AuthPage>
    );
};
