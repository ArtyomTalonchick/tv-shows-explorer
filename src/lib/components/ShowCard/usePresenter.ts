export type ShowCardProps = {
  name: string;
  // Where the card leads; it opens in a new tab.
  href: string;
  image: string | null;
  rating: number | null;
  // The line under the name, e.g. «2017–2020 · Drama, Science-Fiction».
  meta: string;
};

export const usePresenter = ({ name, href, image, rating, meta }: ShowCardProps) => {
  return {
    name,
    href,
    imageSrc: image ?? undefined,
    imageAlt: `${name} poster`,
    hasImage: image !== null,
    // A whole rating keeps its decimal: «★ 8.0», like «★ 8.2».
    ratingLabel: rating === null ? null : `★ ${rating.toFixed(1)}`,
    meta,
  };
};
