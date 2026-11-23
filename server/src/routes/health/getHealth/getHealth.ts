import type { Handler } from "hono";

// The answer of `GET /api/health`: the server is up.
type HealthResponse = {
    status: "ok";
};

// `GET /api/health`: the server is up.
export const getHealth: Handler = (context) => {
    const body: HealthResponse = { status: "ok" };
    return context.json(body);
};
