import { fireEvent, render, screen } from "@testing-library/react";
import type { SessionResponse } from "@tv-shows-explorer/shared";
import { useSessionStore } from "~/stores/useSessionStore";
import { Provider } from "~/App/Provider/Provider";
import { SignUpPage } from "../SignUpPage";

const SESSION: SessionResponse = {
    accessToken: "access",
    refreshToken: "refresh",
    user: { id: "u1", email: "anna@example.com" },
};

const email = (): HTMLElement => screen.getByLabelText("Email");
const password = (): HTMLElement => screen.getByLabelText("Password");
const submit = (): HTMLElement => screen.getByRole("button", { name: "Create account" });

const fillAndSubmit = (): void => {
    fireEvent.change(email(), { target: { value: "anna@example.com" } });
    fireEvent.change(password(), { target: { value: "severance" } });
    fireEvent.click(submit());
};

describe("SignUpPage", () => {
    beforeEach(() => {
        useSessionStore.setState({ session: null });
        render(
            <Provider>
                <SignUpPage />
            </Provider>,
        );
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("gives the password rule as a hint before anything is typed", () => {
        expect(password()).toHaveAccessibleDescription("At least 8 characters");
    });

    it("checks a field when it is left, sends nothing while one is wrong and drops an error once right", async () => {
        const fetchMock = vi.fn();
        vi.stubGlobal("fetch", fetchMock);

        fireEvent.change(email(), { target: { value: "anna@example" } });
        fireEvent.blur(email());

        expect(await screen.findByText("Enter an email like name@example.com")).toBeInTheDocument();
        expect(email()).toBeInvalid();

        fireEvent.change(password(), { target: { value: "dark" } });
        fireEvent.click(submit());

        await vi.waitFor(() =>
            expect(password()).toHaveAccessibleDescription("The password needs at least 8 characters"),
        );
        expect(email()).toHaveFocus();
        expect(fetchMock).not.toHaveBeenCalled();

        fireEvent.change(email(), { target: { value: "anna@example.com" } });

        await vi.waitFor(() => expect(email()).not.toHaveAccessibleDescription());
        expect(email()).toBeValid();
    });

    it("signs the new account in", async () => {
        vi.stubGlobal("fetch", async () => new Response(JSON.stringify(SESSION), { status: 201 }));

        fillAndSubmit();

        await vi.waitFor(() => expect(useSessionStore.getState().session).toEqual(SESSION));
    });

    it("puts a taken email under the email field, with the way to sign in, until the email changes", async () => {
        vi.stubGlobal("fetch", async () => new Response(JSON.stringify({ error: "taken" }), { status: 409 }));

        fillAndSubmit();

        const link = await screen.findByRole("link", { name: "Sign in instead" });
        expect(link).toHaveAttribute("href", "/sign-in");
        expect(email()).toHaveAccessibleDescription("This email already has an account. Sign in instead");
        expect(email()).toBeInvalid();
        expect(screen.queryByRole("alert")).not.toBeInTheDocument();

        fireEvent.change(email(), { target: { value: "anna.k@example.com" } });

        await vi.waitFor(() => expect(email()).not.toHaveAccessibleDescription());
    });

    it("answers a failure with an alert, keeps the values and tries again on «Create account»", async () => {
        const fetchMock = vi.fn(async () => new Response(JSON.stringify({ error: "busy" }), { status: 502 }));
        vi.stubGlobal("fetch", fetchMock);

        fillAndSubmit();

        expect(await screen.findByRole("alert")).toHaveTextContent(
            "Couldn’t reach the server. Check your connection and try again.",
        );
        expect(email()).toHaveValue("anna@example.com");
        expect(password()).toHaveValue("severance");

        fireEvent.click(submit());

        await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
        expect(useSessionStore.getState().session).toBeNull();
    });
});
