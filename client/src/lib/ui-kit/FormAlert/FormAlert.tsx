import { Box, Text } from "@chakra-ui/react";
import type { FC, ReactNode } from "react";
import { Icon } from "~/lib/ui-kit/Icon/Icon";

type FormAlertProps = {
    children: ReactNode;
};

// .form-alert of design/library: what went wrong with the whole form, above its fields.
export const FormAlert: FC<FormAlertProps> = ({ children }) => {
    return (
        <Box
            role="alert"
            display="flex"
            alignItems="flex-start"
            gap="3"
            py="3"
            px="4"
            borderWidth="1px"
            borderColor="accent.solid"
            rounded="md"
            bg="accent.subtle"
            color="fg"
            fontSize="sm"
        >
            <Icon name="alert" boxSize="4" mt="1px" color="accent.fg" />
            <Text>{children}</Text>
        </Box>
    );
};
