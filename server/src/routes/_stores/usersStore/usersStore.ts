import { usersCollection } from "./usersCollection";

// A user as the server keeps it. `email` is normalized (`tasks/users/normalizeEmail`); `passwordHash` is
// `hashPassword`'s answer, never the password. `createdAt` is ms since the epoch.
export type StoredUser = {
    id: string;
    email: string;
    passwordHash: string;
    createdAt: number;
};

// The accounts, in Firestore wherever the server runs, as the favorites are; the tests mock it. A document per user,
// named by its id: `users/{id}`. Reached by the tasks of the `/users` and `/session` routes.
export const usersStore = {
    // Adds the user. It does not check the email: sign-up does, before it calls this. It writes only the fields of
    // `StoredUser`, so a field the caller adds by mistake, a password most of all, never reaches the database.
    create: async (user: StoredUser): Promise<void> => {
        const { id, email, passwordHash, createdAt } = user;
        await usersCollection().doc(id).set({ id, email, passwordHash, createdAt });
    },
    // The user with this id; null when there is none.
    get: async (id: string): Promise<StoredUser | null> => {
        const snapshot = await usersCollection().doc(id).get();
        return snapshot.exists ? (snapshot.data() as StoredUser) : null;
    },
    // The user of this normalized email; null when the email has no account.
    findByEmail: async (email: string): Promise<StoredUser | null> => {
        const snapshot = await usersCollection().where("email", "==", email).limit(1).get();
        const doc = snapshot.docs[0];
        return doc === undefined ? null : (doc.data() as StoredUser);
    },
};
