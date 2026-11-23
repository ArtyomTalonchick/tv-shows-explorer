// The refresh token of a `POST /api/session/refresh` body (`RefreshBody`): a JSON object with a string
// `refreshToken`; null for anything else.
export const parseRefreshToken = (text: string): string | null => {
    const body = ((): unknown => {
        try {
            return JSON.parse(text);
        } catch {
            return null;
        }
    })();
    if (typeof body !== "object" || body === null) {
        return null;
    }

    const { refreshToken } = body as Record<string, unknown>;
    return typeof refreshToken === "string" ? refreshToken : null;
};
