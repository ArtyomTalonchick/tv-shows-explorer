export type ShowCardProps = {
  name: string;
  // Where the card leads; it opens in a new tab.
  href: string;
  image: string | null;
  rating: number | null;
  // The line under the name, e.g. «2017–2020 · Drama, Science-Fiction».
  meta: string;
};

type UsePresenterResult = Pick<ShowCardProps, "name" | "href" | "meta"> & {
  imageSrc: string | undefined;
  imageAlt: string;
  hasImage: boolean;
  // A whole rating keeps its decimal: «★ 8.0», like «★ 8.2».
  ratingLabel: string | null;
};

export const usePresenter = ({ name, href, image, rating, meta }: ShowCardProps): UsePresenterResult => {
  return {
    name,
    href,
    imageSrc: image ?? undefined,
    imageAlt: `${name} poster`,
    hasImage: image !== null,
    ratingLabel: rating === null ? null : `★ ${rating.toFixed(1)}`,
    meta,
  };
};
