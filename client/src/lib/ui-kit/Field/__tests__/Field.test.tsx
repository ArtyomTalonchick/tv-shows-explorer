import { ChakraProvider } from "@chakra-ui/react";
import { fireEvent, render, screen } from "@testing-library/react";
import { system } from "~/lib/theme/system";
import { Field, type FieldProps } from "../Field";

const renderField = (props: Partial<FieldProps> = {}) => {
    const onChange = vi.fn();
    render(
        <ChakraProvider value={system}>
            <Field label="Email" type="email" value="anna@example.com" onChange={onChange} {...props} />
        </ChakraProvider>,
    );
    return { onChange, input: screen.getByLabelText("Email", { selector: "input" }) };
};

describe("Field", () => {
    it("names the input by its label, passes the typed value on and describes it by the hint", () => {
        const { onChange, input } = renderField({ hint: "We never share it" });

        fireEvent.change(input, { target: { value: "anna@example" } });

        expect(onChange).toHaveBeenCalledWith("anna@example");
        expect(input).toHaveAttribute("type", "email");
        expect(input).toHaveAccessibleDescription("We never share it");
        expect(input).not.toHaveAttribute("aria-invalid");
    });

    it("shows the error in place of the hint and marks the input invalid", () => {
        const { input } = renderField({ hint: "We never share it", error: "Enter an email like name@example.com" });

        expect(input).toHaveAttribute("aria-invalid", "true");
        expect(input).toHaveAccessibleDescription("Enter an email like name@example.com");
        expect(screen.queryByText("We never share it")).not.toBeInTheDocument();
    });

    it("puts the end element inside its frame, after the input", () => {
        renderField({ endElement: <button type="button">Clear</button> });

        expect(screen.getByRole("button", { name: "Clear" })).toBeInTheDocument();
    });
});
