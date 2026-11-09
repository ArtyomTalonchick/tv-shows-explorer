import { ChakraProvider } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { system } from "@/lib/theme/system";

export function Provider({ children }: { children: ReactNode }) {
  return <ChakraProvider value={system}>{children}</ChakraProvider>;
}
