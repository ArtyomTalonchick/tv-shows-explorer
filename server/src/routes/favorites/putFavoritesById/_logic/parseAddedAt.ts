// The time a show is added at, from the text of the `PUT /api/favorites/:id` body (`AddFavoriteBody`): `now` for
// an empty body or one without `addedAt`, the given time for a show put back, or null when the body is not such JSON.
export const parseAddedAt = (text: string, now: number): number | null => {
    if (text.trim() === "") {
        return now;
    }

    const body = ((): unknown => {
        try {
            return JSON.parse(text);
        } catch {
            return null;
        }
    })();
    const isObject = typeof body === "object" && body !== null && !Array.isArray(body);
    if (!isObject) {
        return null;
    }

    const { addedAt } = body as Record<string, unknown>;
    if (addedAt === undefined) {
        return now;
    }

    const isTime = typeof addedAt === "number" && Number.isSafeInteger(addedAt) && addedAt > 0;
    return isTime ? addedAt : null;
};
