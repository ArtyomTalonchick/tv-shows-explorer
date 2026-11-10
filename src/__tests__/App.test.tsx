import { act, fireEvent, render, screen } from "@testing-library/react";
import { App } from "../App";
import { Provider } from "../app/Provider";

const renderApp = (): void => {
  render(
    <Provider>
      <App />
    </Provider>,
  );
};

const searchbox = (): HTMLElement => screen.getByRole("searchbox", { name: "Search shows" });

describe("App", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("starts with the search field only and sends no request", () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    renderApp();

    expect(screen.getByRole("heading", { level: 1, name: "Find your next obsession." })).toBeInTheDocument();
    expect(searchbox()).toHaveValue("");
    expect(searchbox()).not.toHaveFocus();
    expect(screen.queryByRole("region", { name: "Search results" })).not.toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("opens the results screen on a tap with its field focused, without focusing the hero field", () => {
    vi.stubGlobal("fetch", vi.fn());
    renderApp();

    const notCancelled = fireEvent.touchEnd(searchbox());

    expect(notCancelled).toBe(false);
    expect(screen.getByRole("heading", { name: "Search for a show" })).toBeInTheDocument();
    expect(searchbox()).toHaveFocus();
  });

  it("opens the results screen on focus, stays there on Clear and goes back to the hero from the logo", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("[]")),
    );
    renderApp();

    act(() => searchbox().focus());

    expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Search for a show" })).toBeInTheDocument();
    expect(searchbox()).toHaveFocus();

    fireEvent.change(searchbox(), { target: { value: "dark" } });
    // The × button replaces the spinner once the request has answered.
    await screen.findByText(/Nothing found/);
    fireEvent.click(screen.getByLabelText("Clear search", { selector: "button" }));

    expect(searchbox()).toHaveValue("");
    expect(searchbox()).toHaveFocus();
    expect(screen.getByRole("heading", { name: "Search for a show" })).toBeInTheDocument();

    fireEvent.change(searchbox(), { target: { value: "dark" } });
    fireEvent.click(screen.getByRole("button", { name: "tv/explorer — back to start" }));

    expect(screen.getByRole("heading", { level: 1, name: "Find your next obsession." })).toBeInTheDocument();
    expect(searchbox()).toHaveValue("");
  });
});
