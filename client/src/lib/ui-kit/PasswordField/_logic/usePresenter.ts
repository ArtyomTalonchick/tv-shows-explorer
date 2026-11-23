import { useState } from "react";
import type { FieldProps } from "~/lib/ui-kit/Field/Field";

// The props of a field, but its type and its end: a password field chooses them itself.
export type PasswordFieldProps = Omit<FieldProps, "type" | "endElement">;

type UsePresenterResult = {
    // The props of the field: the caller's, with the type the eye chose.
    fieldProps: FieldProps;
    eye: { label: string; icon: "eye" | "eye-off"; disabled: boolean; onClick: () => void };
};

export const usePresenter = (props: PasswordFieldProps): UsePresenterResult => {
    const [isShown, setIsShown] = useState(false);

    return {
        fieldProps: { ...props, type: isShown ? "text" : "password" },
        eye: {
            label: isShown ? "Hide password" : "Show password",
            icon: isShown ? "eye-off" : "eye",
            disabled: props.disabled === true,
            onClick: () => setIsShown(!isShown),
        },
    };
};
