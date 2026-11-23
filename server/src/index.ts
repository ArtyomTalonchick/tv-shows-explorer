import { serve } from "@hono/node-server";
import { checkGoogleCredentials } from "./_logic/_tasks/checkGoogleCredentials";
import { createApp } from "./createApp";

const PORT = Number(process.env.PORT ?? 4310);

// The local server uses the real Firestore, so it does not start without the credentials to reach it.
const problem = await checkGoogleCredentials();
if (problem !== null) {
    console.error(`The server cannot reach Firestore. ${problem}`);
    process.exit(1);
}

serve({ fetch: createApp().fetch, port: PORT }, (info) => {
    console.log(`Server listening on http://localhost:${info.port}`);
});
