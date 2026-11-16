import { serve } from "@hono/node-server";
import { createApp } from "./createApp";

const PORT = Number(process.env.PORT ?? 3000);

serve({ fetch: createApp().fetch, port: PORT }, (info) => {
  console.log(`Server listening on http://localhost:${info.port}`);
});
