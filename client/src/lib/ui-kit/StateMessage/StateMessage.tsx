import { Box, Heading, Text, type BoxProps } from "@chakra-ui/react";
import type { FC } from "react";
import { Icon } from "@/lib/ui-kit/Icon/Icon";
import { usePresenter, type StateMessageProps } from "./_logic/usePresenter";

export type { StateMessageProps } from "./_logic/usePresenter";

type Tone = NonNullable<StateMessageProps["tone"]>;

// What changes between the tones: an error has a solid border and an accent icon.
const TONE_STYLES = {
    neutral: { root: { borderStyle: "dashed" }, indicator: { color: "fg.muted" } },
    error: { root: { borderStyle: "solid" }, indicator: { color: "accent.fg" } },
} satisfies Record<Tone, { root: BoxProps; indicator: BoxProps }>;

// .state and .state--error of design/library: EmptyState and ErrorState.
export const StateMessage: FC<StateMessageProps> = (props) => {
    const { icon, title, text, action, tone, role } = usePresenter(props);

    return (
        <Box
            role={role}
            display="grid"
            justifyItems="center"
            alignContent="center"
            gap="3"
            textAlign="center"
            py="16"
            px="6"
            borderWidth="1px"
            borderColor="border"
            rounded="lg"
            {...TONE_STYLES[tone].root}
        >
            <Box
                display="grid"
                placeItems="center"
                boxSize="16"
                mb="2"
                rounded="full"
                bg="bg.subtle"
                {...TONE_STYLES[tone].indicator}
            >
                <Icon name={icon} boxSize="8" strokeWidth="1.75" />
            </Box>
            <Heading as="h3" fontSize="xl" fontWeight="bold">
                {title}
            </Heading>
            <Text color="fg.muted" maxW="prose">
                {text}
            </Text>
            {action && <Box mt="3">{action}</Box>}
        </Box>
    );
};
