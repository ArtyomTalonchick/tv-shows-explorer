import { favoritesStore } from "~/routes/favorites/_stores/favoritesStore/favoritesStore";
import { removeFavorite } from "../removeFavorite";

vi.mock("~/routes/favorites/_stores/favoritesStore/favoritesStore", () => {
    return { favoritesStore: { remove: vi.fn() } };
});

describe("removeFavorite", () => {
    afterEach(() => {
        vi.resetAllMocks();
    });

    it("removes the show from the list of the given user", async () => {
        await removeFavorite("u1", 1);

        expect(favoritesStore.remove).toHaveBeenCalledExactlyOnceWith("u1", 1);
    });
});
