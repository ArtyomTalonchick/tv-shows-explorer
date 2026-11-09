import { render, screen } from "@testing-library/react";
import { App } from "../App";
import { Provider } from "../app/Provider";

describe("App", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("starts with the search field only and sends no request", () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    render(
      <Provider>
        <App />
      </Provider>,
    );

    expect(screen.getByRole("heading", { level: 1, name: "Find your next obsession." })).toBeInTheDocument();
    expect(screen.getByRole("searchbox", { name: "Search shows" })).toHaveValue("");
    expect(screen.queryByRole("region", { name: "Search results" })).not.toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
