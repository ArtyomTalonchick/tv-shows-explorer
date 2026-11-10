import type { RequestAnswer } from "@/lib/hooks/useRequest";
import { getSearchView } from "../getSearchView";
import type { Show } from "../types";

const show = (id: number, name: string): Show => ({
  id,
  name,
  genres: [],
  rating: null,
  premiered: null,
  ended: null,
  image: null,
  url: `https://www.tvmaze.com/shows/${id}`,
});

const found = (query: string, shows: Show[]): RequestAnswer<string, Show[]> => ({
  params: query,
  attempt: 0,
  data: shows,
  failed: false,
});
const failed = (query: string): RequestAnswer<string, Show[]> => ({
  params: query,
  attempt: 0,
  data: null,
  failed: true,
});

describe("getSearchView", () => {
  it("is idle for an empty query, whatever was answered", () => {
    const dark = found("dark", [show(1, "Dark")]);

    expect(getSearchView({ query: "", debounced: "dark", current: dark, latest: dark })).toEqual({
      status: "idle",
      shows: [],
      shownQuery: "",
      isLoading: false,
    });
  });

  it("is loading with nothing to show before the first answer", () => {
    expect(getSearchView({ query: "dark", debounced: "dar", current: null, latest: null })).toEqual({
      status: "loading",
      shows: [],
      shownQuery: "dark",
      isLoading: true,
    });
  });

  it("shows the answer to the query as it is now", () => {
    const dark = found("dark", [show(1, "Dark")]);

    expect(getSearchView({ query: "dark", debounced: "dark", current: dark, latest: dark })).toEqual({
      status: "results",
      shows: [show(1, "Dark")],
      shownQuery: "dark",
      isLoading: false,
    });
  });

  it("reports an empty and a failed answer", () => {
    const empty = found("qwzx", []);
    const error = failed("dark");

    expect(getSearchView({ query: "qwzx", debounced: "qwzx", current: empty, latest: empty }).status).toBe("empty");
    expect(getSearchView({ query: "dark", debounced: "dark", current: error, latest: error }).status).toBe("error");
  });

  it("keeps found shows on screen while the next query loads", () => {
    const forest = found("forest", [show(1, "Forest")]);

    expect(getSearchView({ query: "forests", debounced: "forests", current: null, latest: forest })).toEqual({
      status: "results",
      shows: [show(1, "Forest")],
      shownQuery: "forest",
      isLoading: true,
    });
  });

  it("does not keep an empty or a failed answer", () => {
    expect(getSearchView({ query: "qwz", debounced: "qwz", current: null, latest: found("qwzx", []) }).status).toBe(
      "loading",
    );
    expect(getSearchView({ query: "da", debounced: "da", current: null, latest: failed("dark") }).status).toBe(
      "loading",
    );
  });
});
