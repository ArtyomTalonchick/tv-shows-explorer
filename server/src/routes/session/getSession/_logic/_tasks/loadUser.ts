import type { User } from "@tv-shows-explorer/shared";
import { usersStore } from "~/routes/_stores/usersStore/usersStore";

// The user of this id as the API shows it, or null when the account is gone.
export const loadUser = async (id: string): Promise<User | null> => {
    const stored = await usersStore.get(id);
    if (stored === null) {
        return null;
    }
    return { id: stored.id, email: stored.email };
};
