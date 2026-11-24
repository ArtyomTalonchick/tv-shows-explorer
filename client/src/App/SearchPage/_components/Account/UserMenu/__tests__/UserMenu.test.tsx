import { fireEvent, render, screen } from "@testing-library/react";
import type { SessionResponse } from "@tv-shows-explorer/shared";
import { useSessionStore } from "~/stores/useSessionStore";
import { Provider } from "~/App/Provider/Provider";
import { UserMenu } from "../UserMenu";

const SESSION: SessionResponse = {
    accessToken: "access",
    refreshToken: "refresh",
    user: { id: "u1", email: "anna@example.com" },
};

const trigger = (): HTMLElement => screen.getByRole("button", { name: "anna@example.com" });

describe("UserMenu", () => {
    beforeEach(() => {
        useSessionStore.setState({ session: SESSION });
        render(
            <Provider>
                <UserMenu />
            </Provider>,
        );
    });

    it("shows only the user's first letter, named by the email, and keeps the email for the panel", () => {
        expect(trigger()).toHaveTextContent(/^a$/);
        expect(trigger()).toHaveAttribute("aria-haspopup", "menu");
        expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });

    it("opens the full email and «Sign out», which signs the user out", async () => {
        fireEvent.click(trigger());

        const menu = await screen.findByRole("menu");
        expect(menu).toHaveTextContent("Signed in as");
        expect(menu).toHaveTextContent("anna@example.com");

        fireEvent.click(screen.getByRole("menuitem", { name: "Sign out" }));

        await vi.waitFor(() => expect(useSessionStore.getState().session).toBeNull());
    });

    it("closes on Escape", async () => {
        fireEvent.click(trigger());
        const menu = await screen.findByRole("menu");

        fireEvent.keyDown(menu, { key: "Escape" });

        await vi.waitFor(() => expect(trigger()).toHaveAttribute("aria-expanded", "false"));
        expect(useSessionStore.getState().session).toEqual(SESSION);
    });
});
