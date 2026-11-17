// The fields of a TVmaze show the app reads: https://www.tvmaze.com/api#show-main-information
export type TvmazeShow = {
    id: number;
    name: string;
    genres: string[];
    rating: { average: number | null } | null;
    premiered: string | null;
    ended: string | null;
    image: { medium: string; original: string } | null;
    url: string;
};
