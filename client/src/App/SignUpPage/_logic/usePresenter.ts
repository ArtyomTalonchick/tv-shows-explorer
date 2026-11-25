import { PASSWORD_MIN_LENGTH, isValidEmail, isValidPassword, type Credentials } from "@tv-shows-explorer/shared";
import type { SubmitEvent } from "react";
import { useController, useForm } from "react-hook-form";
import { useLocation } from "react-router";
import { EMAIL_FORMAT_ERROR, SERVER_FAILED_ALERT } from "~/App/constants";
import type { FieldProps } from "~/lib/ui-kit/Field/Field";
import type { PasswordFieldProps } from "~/lib/ui-kit/PasswordField/PasswordField";
import { toPendingFavorite } from "~/tasks/favorites/toPendingFavorite";
import type { EmailErrorProps } from "../EmailError/EmailError";
import { signUp } from "./_tasks/signUp";

type UsePresenterResult = {
    // The server did not answer the last request, above the fields.
    alert: string | null;
    email: FieldProps;
    // The error under the email field, or null while the email has none.
    emailError: EmailErrorProps | null;
    password: PasswordFieldProps;
    // A request is on its way: the fields are disabled and the button shows a spinner.
    isLoading: boolean;
    handleSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
};

// The sign-up form. A field is checked when it is left and on «Create account», and from then on as it changes, so
// an error goes once its value is right; a request goes only with both right, else the first wrong field takes the
// focus. A taken email stands under the email field until the email changes. The values stay after a failure, for a
// fix or a retry.
export const usePresenter = (): UsePresenterResult => {
    const { control, formState, setError, handleSubmit } = useForm<Credentials>({
        mode: "onTouched",
        defaultValues: { email: "", password: "" },
    });
    const email = useController({
        control,
        name: "email",
        rules: { validate: (value) => isValidEmail(value) || EMAIL_FORMAT_ERROR },
    });
    const password = useController({
        control,
        name: "password",
        rules: {
            validate: (value) =>
                isValidPassword(value) || `The password needs at least ${PASSWORD_MIN_LENGTH} characters`,
        },
    });
    const isLoading = formState.isSubmitting;
    // The show a guest bookmarked, when they came by the «Sign in» of its toast and then the sign-in page.
    const pending = toPendingFavorite(useLocation().state);
    const emailFieldError = email.fieldState.error;

    const submit = async (credentials: Credentials): Promise<void> => {
        const result = await signUp(credentials, pending);
        if (result === "email-taken") {
            setError("email", { type: "taken" });
        }
        if (result === "failed") {
            setError("root", { message: SERVER_FAILED_ALERT });
        }
    };

    return {
        alert: formState.errors.root?.message ?? null,
        email: {
            ...email.field,
            label: "Email",
            type: "email",
            autoComplete: "email",
            placeholder: "name@example.com",
            disabled: isLoading,
        },
        emailError: emailFieldError
            ? { isTaken: emailFieldError.type === "taken", message: emailFieldError.message ?? "" }
            : null,
        password: {
            ...password.field,
            label: "Password",
            autoComplete: "new-password",
            hint: `At least ${PASSWORD_MIN_LENGTH} characters`,
            error: password.fieldState.error?.message,
            disabled: isLoading,
        },
        isLoading,
        handleSubmit: (event: SubmitEvent<HTMLFormElement>) => void handleSubmit(submit)(event),
    };
};
