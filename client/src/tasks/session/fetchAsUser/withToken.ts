import type { JsonRequestInit } from "~/lib/http/fetchJson";

// The request as the signed-in user: the access token in `Authorization: Bearer`, next to the caller's headers; as it
// is for a guest.
export const withToken = (init: JsonRequestInit, accessToken: string | undefined): JsonRequestInit => {
    const headers = new Headers(init.headers);
    if (accessToken !== undefined) {
        headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return { ...init, headers };
};
