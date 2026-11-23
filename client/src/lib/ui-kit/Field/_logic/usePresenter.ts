import type { HTMLChakraProps } from "@chakra-ui/react";
import { useId, type ChangeEvent, type ReactNode, type Ref } from "react";

// The props of the input itself (`type`, `placeholder`, `autoComplete`, `disabled`, `onBlur`, `ref`…) go to it as they
// are. Taken over here: the value is a string, and `onChange` gets it instead of the event.
export type FieldProps = Omit<HTMLChakraProps<"input">, "value" | "onChange"> & {
    label: string;
    value: string;
    onChange: (value: string) => void;
    // Under the field while it has no error: what the value must be.
    hint?: string;
    // Under the field in place of the hint, and the field is marked invalid; it may hold a link.
    error?: ReactNode;
    // Inside the frame after the input: a button of a field that extends this one, such as the eye of a password.
    endElement?: ReactNode;
    // Chakra's props leave out the ref; it goes to the input too.
    ref?: Ref<HTMLInputElement>;
};

type UsePresenterResult = Pick<FieldProps, "label" | "value" | "hint" | "error" | "endElement"> & {
    // The rest of the props, for the input.
    inputProps: HTMLChakraProps<"input"> & { ref?: Ref<HTMLInputElement> };
    // The error is shown in place of the hint.
    isInvalid: boolean;
    // `aria-invalid` of the input: absent while it is valid.
    ariaInvalid: true | undefined;
    // The id of the input, which its label names.
    inputId: string;
    // The id of the hint or the error under the input.
    noteId: string;
    // `aria-describedby` of the input: the note, while there is one.
    describedBy: string | undefined;
    handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export const usePresenter = ({
    label,
    value,
    onChange,
    hint,
    error,
    endElement,
    ...inputProps
}: FieldProps): UsePresenterResult => {
    const inputId = useId();
    const noteId = useId();
    const isInvalid = error !== undefined && error !== null;
    const hasNote = isInvalid || (hint !== undefined && hint !== "");

    return {
        label,
        value,
        hint,
        error,
        endElement,
        inputProps,
        isInvalid,
        ariaInvalid: isInvalid ? true : undefined,
        inputId,
        noteId,
        describedBy: hasNote ? noteId : undefined,
        handleChange: (event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value),
    };
};
