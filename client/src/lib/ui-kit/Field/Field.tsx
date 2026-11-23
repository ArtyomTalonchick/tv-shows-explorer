import { chakra } from "@chakra-ui/react";
import type { FC } from "react";
import { Icon } from "~/lib/ui-kit/Icon/Icon";
import { usePresenter, type FieldProps } from "./_logic/usePresenter";

export type { FieldProps } from "./_logic/usePresenter";

// .field of design/library: a label, the input in its frame and a hint or an error under it.
export const Field: FC<FieldProps> = (props) => {
    const {
        label,
        value,
        hint,
        error,
        endElement,
        inputProps,
        isInvalid,
        ariaInvalid,
        inputId,
        noteId,
        describedBy,
        handleChange,
    } = usePresenter(props);

    return (
        <chakra.div display="grid" alignContent="start" gap="2" minW="0">
            <chakra.label htmlFor={inputId} fontSize="sm" fontWeight="semibold" color="fg">
                {label}
            </chakra.label>
            <chakra.span
                display="flex"
                alignItems="center"
                gap="2"
                py="1"
                pe="1"
                ps="4"
                borderWidth="1px"
                borderColor="border"
                rounded="md"
                bg="bg"
                transition="border-color {durations.fast} {easings.standard}"
                // In this order, as in design/library: an invalid field keeps its accent border on hover.
                css={{
                    "&:hover": { borderColor: "fg.subtle" },
                    "&:has([aria-invalid=true]), &:focus-within": { borderColor: "accent.solid" },
                    "&:has(input:disabled)": { opacity: 0.5 },
                }}
            >
                <chakra.input
                    flex="1"
                    minW="0"
                    minH="10"
                    bg="transparent"
                    border="0"
                    p="0"
                    color="fg"
                    fontSize="md"
                    fontWeight="medium"
                    outline="none"
                    _placeholder={{ color: "fg.subtle" }}
                    _disabled={{ cursor: "not-allowed" }}
                    // The browser paints an autofilled input in its own colours: an inset shadow of the field's
                    // background covers its fill, and the fill itself waits for a transition that never ends.
                    _autofill={{
                        boxShadow: "0 0 0 1000px {colors.bg} inset",
                        WebkitTextFillColor: "{colors.fg}",
                        caretColor: "{colors.fg}",
                        transition: "background-color 600000s 0s",
                    }}
                    // After the styles, so a caller can change one; before the field's own props, so it cannot replace them.
                    {...inputProps}
                    id={inputId}
                    value={value}
                    onChange={handleChange}
                    aria-invalid={ariaInvalid}
                    aria-describedby={describedBy}
                />
                {endElement}
            </chakra.span>
            {isInvalid ? (
                <chakra.span
                    id={noteId}
                    display="flex"
                    alignItems="flex-start"
                    gap="2"
                    color="accent.fg"
                    fontSize="sm"
                    fontWeight="medium"
                >
                    <Icon name="alert" boxSize="4" mt="1px" flex="none" />
                    <span>{error}</span>
                </chakra.span>
            ) : (
                hint && (
                    <chakra.span id={noteId} color="fg.subtle" fontSize="sm">
                        {hint}
                    </chakra.span>
                )
            )}
        </chakra.div>
    );
};
