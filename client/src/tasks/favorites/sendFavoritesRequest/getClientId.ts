// Where the browser keeps the id that names its list of favorites.
const CLIENT_ID_KEY = "tv-shows-explorer:client-id";

// The browser's client id: made once with `crypto.randomUUID()` and kept in `localStorage`, so the list stays the
// browser's own until its data is cleared.
export const getClientId = (): string => {
    const saved = localStorage.getItem(CLIENT_ID_KEY);
    if (saved !== null) {
        return saved;
    }

    const created = crypto.randomUUID();
    localStorage.setItem(CLIENT_ID_KEY, created);
    return created;
};
