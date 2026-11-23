import { fireEvent, render, screen } from "@testing-library/react";
import type { SessionResponse } from "@tv-shows-explorer/shared";
import { useSessionStore } from "~/App/_stores/useSessionStore";
import { Provider } from "~/App/Provider/Provider";
import { SignInPage } from "../SignInPage";

const SESSION: SessionResponse = {
    accessToken: "access",
    refreshToken: "refresh",
    user: { id: "u1", email: "anna@example.com" },
};

// An answer the test sends when it says so.
const deferred = () => {
    const callbacks: { respond: (response: Response) => void } = { respond: () => {} };
    const promise = new Promise<Response>((resolve) => {
        callbacks.respond = resolve;
    });
    return { promise, ...callbacks };
};

const email = (): HTMLElement => screen.getByLabelText("Email");
const password = (): HTMLElement => screen.getByLabelText("Password");

const fillAndSubmit = (): void => {
    fireEvent.change(email(), { target: { value: "anna@example.com" } });
    fireEvent.change(password(), { target: { value: "severance" } });
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));
};

describe("SignInPage", () => {
    beforeEach(() => {
        useSessionStore.setState({ session: null });
        render(
            <Provider>
                <SignInPage />
            </Provider>,
        );
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("checks the fields on «Sign in», sends nothing while one is wrong and drops an error once right", async () => {
        const fetchMock = vi.fn();
        vi.stubGlobal("fetch", fetchMock);

        expect(screen.queryByText("Enter your password")).not.toBeInTheDocument();
        fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

        expect(await screen.findByText("Enter an email like name@example.com")).toBeInTheDocument();
        expect(email()).toHaveAccessibleDescription("Enter an email like name@example.com");
        expect(password()).toHaveAccessibleDescription("Enter your password");
        expect(email()).toBeInvalid();
        expect(email()).toHaveFocus();
        expect(fetchMock).not.toHaveBeenCalled();

        fireEvent.change(email(), { target: { value: "anna@example.com" } });

        await vi.waitFor(() => expect(email()).not.toHaveAccessibleDescription());
        expect(email()).toBeValid();
    });

    it("disables the form while the request is on its way, then signs the user in", async () => {
        const answer = deferred();
        vi.stubGlobal("fetch", () => answer.promise);

        fillAndSubmit();

        expect(await screen.findByRole("button", { name: "Signing in…" })).toBeDisabled();
        expect(email()).toBeDisabled();
        expect(password()).toBeDisabled();
        expect(screen.getByRole("button", { name: "Show password" })).toBeDisabled();

        answer.respond(new Response(JSON.stringify(SESSION)));

        await vi.waitFor(() => expect(useSessionStore.getState().session).toEqual(SESSION));
    });

    it.each([
        [401, "Wrong email or password."],
        [502, "Couldn’t reach the server. Check your connection and try again."],
    ])("answers %i with an alert, keeps the values and tries again on «Sign in»", async (status, text) => {
        const fetchMock = vi.fn(async () => new Response(JSON.stringify({ error: "no" }), { status }));
        vi.stubGlobal("fetch", fetchMock);

        fillAndSubmit();

        expect(await screen.findByRole("alert")).toHaveTextContent(text);
        expect(email()).toHaveValue("anna@example.com");
        expect(password()).toHaveValue("severance");
        expect(email()).toBeEnabled();

        fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

        await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
        expect(useSessionStore.getState().session).toBeNull();
    });
});
