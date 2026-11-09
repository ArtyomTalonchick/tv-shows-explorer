import { ChakraProvider } from "@chakra-ui/react";
import { fireEvent, render, screen } from "@testing-library/react";
import { system } from "@/lib/theme/system";
import { Pagination } from "../Pagination";

const renderPage = (page: number, onPageChange = vi.fn()) => {
  render(
    <ChakraProvider value={system}>
      <Pagination page={page} perPage={3} total={8} onPageChange={onPageChange} />
    </ChakraProvider>,
  );
  return onPageChange;
};

describe("Pagination", () => {
  it("shows a button per page, marks the current one and the range of shows", () => {
    renderPage(2);

    expect(screen.getAllByRole("button", { name: /^\d$/ }).map((button) => button.textContent)).toEqual([
      "1",
      "2",
      "3",
    ]);
    expect(screen.getByRole("button", { name: "2" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByText("Shows 4–6 of 8")).toBeInTheDocument();
  });

  it("turns off Previous on the first page and Next on the last", () => {
    renderPage(1);
    expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next page" })).toBeEnabled();
  });

  it("counts the last page up to the total", () => {
    renderPage(3);

    expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
    expect(screen.getByText("Shows 7–8 of 8")).toBeInTheDocument();
  });

  it("names the one item of a page that holds only it", () => {
    render(
      <ChakraProvider value={system}>
        <Pagination page={4} perPage={3} total={10} onPageChange={vi.fn()} />
      </ChakraProvider>,
    );

    expect(screen.getByText("Shows 10 of 10")).toBeInTheDocument();
  });

  it("asks for the previous, the next and a chosen page", () => {
    const onPageChange = renderPage(2);

    fireEvent.click(screen.getByRole("button", { name: "Previous page" }));
    fireEvent.click(screen.getByRole("button", { name: "Next page" }));
    fireEvent.click(screen.getByRole("button", { name: "3" }));

    expect(onPageChange.mock.calls).toEqual([[1], [3], [3]]);
  });
});
