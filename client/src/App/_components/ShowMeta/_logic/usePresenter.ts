import type { HTMLChakraProps } from "@chakra-ui/react";
import type { Show } from "@tv-shows-explorer/shared";
import { formatShowMeta } from "./formatShowMeta";

// The props of the line itself (`mt`, `truncate`…) go to it as they are, after its own styles.
export type ShowMetaProps = Omit<HTMLChakraProps<"span">, "children"> & {
    show: Pick<Show, "premiered" | "ended" | "genres">;
};

type UsePresenterResult = {
    // «2017–2020 · Drama, Science-Fiction».
    text: string;
    spanProps: HTMLChakraProps<"span">;
};

export const usePresenter = ({ show, ...spanProps }: ShowMetaProps): UsePresenterResult => {
    return { text: formatShowMeta(show), spanProps };
};
