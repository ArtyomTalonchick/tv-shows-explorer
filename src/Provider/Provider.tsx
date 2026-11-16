import { ChakraProvider } from "@chakra-ui/react";
import type { FC, ReactNode } from "react";
import { system } from "@/lib/theme/system";

type ProviderProps = {
  children: ReactNode;
};

export const Provider: FC<ProviderProps> = ({ children }) => {
  return <ChakraProvider value={system}>{children}</ChakraProvider>;
};
