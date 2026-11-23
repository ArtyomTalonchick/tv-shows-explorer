import { ChakraProvider } from "@chakra-ui/react";
import { fireEvent, render, screen } from "@testing-library/react";
import { system } from "~/lib/theme/system";
import { PasswordField, type PasswordFieldProps } from "../PasswordField";

const renderField = (props: Partial<PasswordFieldProps> = {}) => {
    render(
        <ChakraProvider value={system}>
            <PasswordField label="Password" value="severance" onChange={vi.fn()} {...props} />
        </ChakraProvider>,
    );
    return screen.getByLabelText("Password", { selector: "input" });
};

describe("PasswordField", () => {
    it("shows the password as text after a press on the eye, and hides it after the next", () => {
        const input = renderField();
        expect(input).toHaveAttribute("type", "password");

        fireEvent.click(screen.getByRole("button", { name: "Show password" }));
        expect(input).toHaveAttribute("type", "text");

        fireEvent.click(screen.getByRole("button", { name: "Hide password" }));
        expect(input).toHaveAttribute("type", "password");
    });

    it("disables the eye with the input", () => {
        const input = renderField({ disabled: true });

        expect(input).toBeDisabled();
        expect(screen.getByRole("button", { name: "Show password" })).toBeDisabled();
    });
});
