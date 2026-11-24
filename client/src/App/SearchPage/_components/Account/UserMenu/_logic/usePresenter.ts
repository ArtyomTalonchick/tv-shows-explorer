import { useSessionStore } from "~/stores/useSessionStore";
import { signOut } from "~/tasks/session/signOut";

type UsePresenterResult = {
    // The signed-in user's email: the trigger's name, and in full in the panel.
    email: string;
    // The avatar's letter, the first of the email.
    initial: string;
    onSignOut: () => void;
};

export const usePresenter = (): UsePresenterResult => {
    const email = useSessionStore(({ session }) => session?.user.email ?? "");

    return { email, initial: email.charAt(0), onSignOut: signOut };
};
