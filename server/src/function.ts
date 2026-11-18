import { getRequestListener } from "@hono/node-server";
import { onRequest } from "firebase-functions/v2/https";
import { createApp } from "./createApp";

// The server on Firebase: one Cloud Function, `https://us-central1-tv-shows-explorer.cloudfunctions.net/server`, that
// answers every path of the app (`…/server/api/shows`). Named `server`, not `api`, so the path does not read
// `/api/api`. The region is next to the Firestore database (`nam5`, the US); at most 2 instances, so a burst of
// traffic cannot run up the bill. `getRequestListener` reads the body Firebase has already parsed (`rawBody`).
export const server = onRequest({ region: "us-central1", maxInstances: 2 }, getRequestListener(createApp().fetch));
