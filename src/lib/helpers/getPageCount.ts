// How many pages `total` items take, `perPage` on each. No items still make one (empty) page.
export const getPageCount = (total: number, perPage: number) => {
  return Math.max(1, Math.ceil(total / perPage));
};
