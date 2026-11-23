import { chakra } from "@chakra-ui/react";
import type { FC } from "react";
import { Field } from "~/lib/ui-kit/Field/Field";
import { Icon } from "~/lib/ui-kit/Icon/Icon";
import { usePresenter, type PasswordFieldProps } from "./_logic/usePresenter";

export type { PasswordFieldProps } from "./_logic/usePresenter";

// .field of design/library for a password: the field with an eye that shows the password as text and hides it again.
export const PasswordField: FC<PasswordFieldProps> = (props) => {
    const { fieldProps, eye } = usePresenter(props);

    return (
        <Field
            {...fieldProps}
            endElement={
                <chakra.button
                    type="button"
                    aria-label={eye.label}
                    onClick={eye.onClick}
                    disabled={eye.disabled}
                    display="grid"
                    placeItems="center"
                    boxSize="10"
                    flex="none"
                    rounded="sm"
                    color="fg.muted"
                    cursor="pointer"
                    _hover={{ bg: "bg.muted", color: "fg" }}
                    _disabled={{ cursor: "not-allowed" }}
                >
                    <Icon name={eye.icon} boxSize="5" />
                </chakra.button>
            }
        />
    );
};
