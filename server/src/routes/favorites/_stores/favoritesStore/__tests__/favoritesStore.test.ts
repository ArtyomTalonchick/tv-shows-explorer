import type { Favorite } from "@tv-shows-explorer/shared";
import { favoritesStore } from "../favoritesStore";

// A fake Firestore: documents by their full path, enough for collection().doc().collection().doc().
const { documents, initializeApp } = vi.hoisted(() => {
    return { documents: new Map<string, unknown>(), initializeApp: vi.fn() };
});

vi.mock("firebase-admin/app", () => {
    return { getApps: () => initializeApp.mock.calls, initializeApp };
});

vi.mock("firebase-admin/firestore", () => {
    const doc = (path: string) => ({
        collection: (name: string) => collection(`${path}/${name}`),
        get: async () => ({ exists: documents.has(path), data: () => documents.get(path) }),
        set: async (data: unknown) => documents.set(path, data),
        delete: async () => documents.delete(path),
    });
    const collection = (path: string) => ({
        doc: (id: string) => doc(`${path}/${id}`),
        get: async () => ({
            docs: [...documents.entries()]
                .filter(([key]) => key.startsWith(`${path}/`) && !key.slice(path.length + 1).includes("/"))
                .map(([, data]) => ({ data: () => data })),
        }),
    });
    return { getFirestore: () => ({ collection }) };
});

const favorite = (id: number): Favorite => ({
    id,
    name: `Show ${id}`,
    genres: ["Drama"],
    premiered: "2017-12-01",
    ended: null,
    image: null,
    url: `https://www.tvmaze.com/shows/${id}`,
    addedAt: id * 100,
});

describe("favoritesStore", () => {
    afterEach(() => {
        documents.clear();
    });

    it("starts Firebase on the first call, not on import, and only once", async () => {
        expect(initializeApp).not.toHaveBeenCalled();

        await favoritesStore.list("u1");
        await favoritesStore.list("u1");

        expect(initializeApp).toHaveBeenCalledTimes(1);
    });

    it("keeps a document per show under the user's id", async () => {
        await favoritesStore.put("u1", favorite(7));

        expect([...documents.entries()]).toEqual([["users/u1/favorites/7", favorite(7)]]);
    });

    it("lists, finds and removes the favorites of the given user only", async () => {
        await favoritesStore.put("u1", favorite(1));
        await favoritesStore.put("u1", favorite(2));
        await favoritesStore.put("u2", favorite(3));

        await favoritesStore.remove("u1", 1);
        await favoritesStore.remove("u1", 5);

        expect(await favoritesStore.list("u1")).toEqual([favorite(2)]);
        expect(await favoritesStore.get("u1", 2)).toEqual(favorite(2));
        expect(await favoritesStore.get("u1", 3)).toBeNull();
        expect(await favoritesStore.list("u3")).toEqual([]);
    });
});
