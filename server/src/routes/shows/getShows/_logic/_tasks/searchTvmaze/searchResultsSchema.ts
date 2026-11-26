import { z } from "zod";
import { tvmazeShowSchema } from "~/tasks/tvmaze/tvmazeShowSchema";

// The results of a TVmaze search: https://www.tvmaze.com/api#show-search
export const searchResultsSchema = z.array(z.object({ show: tvmazeShowSchema }));
