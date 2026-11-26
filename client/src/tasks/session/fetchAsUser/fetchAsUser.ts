import type { z } from "zod";
import { HttpError } from "~/lib/http/HttpError";
import { fetchJson, type JsonRequestInit } from "~/lib/http/fetchJson";
import { useSessionStore } from "~/stores/useSessionStore";
import { refreshSession } from "~/tasks/session/refreshSession";
import { withToken } from "./withToken";

// Sends a request of the API as the signed-in user, as `fetchJson` does. The access token lives a minute, so a 401
// refreshes the session once (`refreshSession`) and repeats the request with the new token; a refresh that brought
// no other token — refused, failed, or a guest — leaves the 401 to the caller. Rejects as `fetchJson` does.
export const fetchAsUser = async <S extends z.ZodType>(
    url: string,
    schema: S,
    init: JsonRequestInit = {},
): Promise<z.output<S>> => {
    const sent = useSessionStore.getState().session?.accessToken;

    const requestWith = (accessToken: string | undefined): Promise<z.output<S>> =>
        fetchJson(url, schema, withToken(init, accessToken));

    try {
        return await requestWith(sent);
    } catch (error) {
        if (!(error instanceof HttpError && error.status === 401)) {
            throw error;
        }
        await refreshSession(init.signal ?? undefined);
        const fresh = useSessionStore.getState().session?.accessToken;
        if (fresh === undefined || fresh === sent) {
            throw error;
        }
        return await requestWith(fresh);
    }
};
