import { verify } from "hono/jwt";
import type { SessionResponse } from "@tv-shows-explorer/shared";
import { hashPassword } from "~/lib/password/hashPassword";
import { usersStore } from "~/routes/_stores/usersStore/usersStore";
import { session } from "../session";

vi.mock("~/routes/_stores/usersStore/usersStore", () => {
    return { usersStore: { create: vi.fn(), get: vi.fn(), findByEmail: vi.fn() } };
});

const signIn = async (body: string) => {
    const response = await session.request("/", { method: "POST", body });
    return { status: response.status, body: (await response.json()) as unknown };
};

describe("POST /", () => {
    beforeAll(async () => {
        const passwordHash = await hashPassword("severance");
        const anna = { id: "u1", email: "anna@example.com", passwordHash, createdAt: 1 };
        vi.mocked(usersStore.findByEmail).mockImplementation(async (email) => {
            return email === anna.email ? anna : null;
        });
    });

    beforeEach(() => {
        vi.stubEnv("JWT_SECRET", "test-secret");
    });

    afterEach(() => {
        vi.unstubAllEnvs();
    });

    it("signs the user in with a token that names them", async () => {
        const { status, body } = await signIn('{"email":"anna@example.com","password":"severance"}');

        expect(status).toBe(200);
        const { token, user } = body as SessionResponse;
        expect(user).toEqual({ id: "u1", email: "anna@example.com" });
        expect(await verify(token, "test-secret", "HS256")).toMatchObject({ sub: "u1", email: "anna@example.com" });
    });

    it("takes the email in any case and with outer spaces", async () => {
        const { status } = await signIn('{"email":"  Anna@Example.COM ","password":"severance"}');

        expect(status).toBe(200);
    });

    it.each([
        ["a wrong password", '{"email":"anna@example.com","password":"severance!"}'],
        ["an unknown email", '{"email":"ben@example.com","password":"severance"}'],
    ])("answers 401 with one message to %s", async (_case, body) => {
        const response = await signIn(body);

        expect(response).toEqual({ status: 401, body: { error: "Wrong email or password" } });
    });

    it.each(["not json", '{"email":"anna@example.com"}', '{"email":1,"password":"severance"}'])(
        "answers 400 to %j",
        async (body) => {
            const response = await signIn(body);

            expect(response.status).toBe(400);
        },
    );

    it("never answers the password or its hash", async () => {
        const { body } = await signIn('{"email":"anna@example.com","password":"severance"}');

        expect(JSON.stringify(body)).not.toContain("severance");
        expect(body).not.toHaveProperty("user.passwordHash");
    });
});
