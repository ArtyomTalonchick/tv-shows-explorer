import { usersStore } from "../usersStore";
import type { StoredUser } from "../usersStore";

// A fake Firestore: the documents of `users` by id, enough for doc().set(), doc().get() and
// where("email", "==", …).limit(1).get().
const { documents, initializeApp } = vi.hoisted(() => {
    return { documents: new Map<string, StoredUser>(), initializeApp: vi.fn() };
});

vi.mock("firebase-admin/app", () => {
    return { getApps: () => initializeApp.mock.calls, initializeApp };
});

vi.mock("firebase-admin/firestore", () => {
    const doc = (id: string) => ({
        set: async (data: StoredUser) => documents.set(id, data),
        get: async () => ({ exists: documents.has(id), data: () => documents.get(id) }),
    });
    const where = (_field: string, _op: string, email: string) => ({
        limit: () => ({
            get: async () => ({
                docs: [...documents.values()]
                    .filter((user) => user.email === email)
                    .map((user) => ({ data: () => user })),
            }),
        }),
    });
    return { getFirestore: () => ({ collection: () => ({ doc, where }) }) };
});

const user = (id: string, email: string): StoredUser => ({ id, email, passwordHash: "salt:hash", createdAt: 1 });

describe("usersStore", () => {
    afterEach(() => {
        documents.clear();
    });

    it("keeps a user under its id", async () => {
        await usersStore.create(user("u1", "anna@example.com"));

        expect(await usersStore.get("u1")).toEqual(user("u1", "anna@example.com"));
    });

    it("keeps only the fields of a stored user", async () => {
        const withPassword = { ...user("u1", "anna@example.com"), password: "severance" };

        await usersStore.create(withPassword);

        expect(await usersStore.get("u1")).toEqual(user("u1", "anna@example.com"));
    });

    it("finds a user by its email", async () => {
        await usersStore.create(user("u1", "anna@example.com"));
        await usersStore.create(user("u2", "ben@example.com"));

        expect(await usersStore.findByEmail("ben@example.com")).toEqual(user("u2", "ben@example.com"));
    });

    it("finds no user for an email or an id without an account", async () => {
        await usersStore.create(user("u1", "anna@example.com"));

        expect(await usersStore.findByEmail("ben@example.com")).toBeNull();
        expect(await usersStore.get("u2")).toBeNull();
    });
});
