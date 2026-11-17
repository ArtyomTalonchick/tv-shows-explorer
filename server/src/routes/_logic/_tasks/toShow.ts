import type { Show } from "@tv-shows-explorer/shared";
import type { TvmazeShow } from "@/routes/_logic/types";

// A TVmaze show as the app uses it: no rating and no image are null, the image is the medium one.
export const toShow = (show: TvmazeShow): Show => {
    return {
        id: show.id,
        name: show.name,
        genres: show.genres,
        rating: show.rating?.average ?? null,
        premiered: show.premiered,
        ended: show.ended,
        image: show.image?.medium ?? null,
        url: show.url,
    };
};
