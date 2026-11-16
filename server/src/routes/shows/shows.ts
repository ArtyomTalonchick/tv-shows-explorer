import { Hono } from "hono";
import { getShows } from "./getShows/getShows";

// `/api/shows`: its methods.
// prettier-ignore
export const shows = new Hono()
  .get("/", getShows);
