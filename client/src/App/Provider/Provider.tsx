import { ChakraProvider } from "@chakra-ui/react";
import type { FC, ReactNode } from "react";
import { BrowserRouter } from "react-router";
import { system } from "~/lib/theme/system";

type ProviderProps = {
    children: ReactNode;
};

// What the app mounts around it: the theme, and the router that reads the page from the address.
export const Provider: FC<ProviderProps> = ({ children }) => {
    return (
        <BrowserRouter>
            <ChakraProvider value={system}>{children}</ChakraProvider>
        </BrowserRouter>
    );
};
