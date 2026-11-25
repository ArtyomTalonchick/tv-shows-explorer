import { isValidEmail, type Credentials } from "@tv-shows-explorer/shared";
import type { SubmitEvent } from "react";
import { useController, useForm } from "react-hook-form";
import { useLocation } from "react-router";
import { EMAIL_FORMAT_ERROR, SERVER_FAILED_ALERT } from "~/App/constants";
import type { FieldProps } from "~/lib/ui-kit/Field/Field";
import type { PasswordFieldProps } from "~/lib/ui-kit/PasswordField/PasswordField";
import { toPendingFavorite } from "~/tasks/favorites/toPendingFavorite";
import { signIn, type SignInResult } from "./_tasks/signIn";

// The form alert after a sign-in that did not sign the user in; a signed-in user leaves the page.
const ALERTS: Record<Exclude<SignInResult, "signed-in">, string> = {
    "wrong-credentials": "Wrong email or password.",
    failed: SERVER_FAILED_ALERT,
};

type UsePresenterResult = {
    // What went wrong with the last request, above the fields.
    alert: string | null;
    email: FieldProps;
    password: PasswordFieldProps;
    // A request is on its way: the fields are disabled and the button shows a spinner.
    isLoading: boolean;
    handleSubmit: (event: SubmitEvent<HTMLFormElement>) => void;
};

// The sign-in form. The fields are checked on «Sign in», and from then on as they change, so an error goes once its
// value is right; a request goes only with both right, else the first wrong field takes the focus. The password's
// length is the sign-up's rule, not repeated here: the server answers a short one as a wrong one. The values stay
// after a failure, for a fix or a retry.
export const usePresenter = (): UsePresenterResult => {
    const { control, formState, setError, handleSubmit } = useForm<Credentials>({
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
        rules: { validate: (value) => value !== "" || "Enter your password" },
    });
    const isLoading = formState.isSubmitting;
    // The show a guest bookmarked, when they came by the «Sign in» of its toast.
    const pending = toPendingFavorite(useLocation().state);

    const submit = async (credentials: Credentials): Promise<void> => {
        const result = await signIn(credentials, pending);
        if (result !== "signed-in") {
            setError("root", { message: ALERTS[result] });
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
            error: email.fieldState.error?.message,
            disabled: isLoading,
        },
        password: {
            ...password.field,
            label: "Password",
            autoComplete: "current-password",
            error: password.fieldState.error?.message,
            disabled: isLoading,
        },
        isLoading,
        handleSubmit: (event: SubmitEvent<HTMLFormElement>) => void handleSubmit(submit)(event),
    };
};
