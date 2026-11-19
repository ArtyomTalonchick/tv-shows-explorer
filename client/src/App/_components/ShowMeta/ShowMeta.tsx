import { chakra } from "@chakra-ui/react";
import type { FC } from "react";
import { usePresenter, type ShowMetaProps } from "./_logic/usePresenter";

export type { ShowMetaProps } from "./_logic/usePresenter";

// The line of details under a show's name, on a show card and in a row of the favourites list: the years and the
// genres, muted.
export const ShowMeta: FC<ShowMetaProps> = (props) => {
    const { text, spanProps } = usePresenter(props);

    return (
        <chakra.span display="block" color="fg.muted" fontSize="sm" {...spanProps}>
            {text}
        </chakra.span>
    );
};
