import { render, screen } from "@testing-library/react";
import { App } from "./App";
import { Provider } from "./app/Provider";

describe("App", () => {
  it("renders the shell headline", () => {
    render(
      <Provider>
        <App />
      </Provider>,
    );

    expect(screen.getByRole("heading", { level: 1, name: "TV Shows Explorer" })).toBeInTheDocument();
  });
});
