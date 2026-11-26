import { sign, verify } from "hono/jwt";
import type { SessionResponse } from "@tv-shows-explorer/shared";
import { hashPassword } from "~/lib/password/hashPassword";
import { usersStore } from "~/routes/_stores/usersStore/usersStore";
import { session } from "../session";

vi.mock("~/routes/_stores/usersStore/usersStore", () => {
    return { usersStore: { create: vi.fn(), get: vi.fn(), findByEmail: vi.fn() } };
});

const post = async (body: string) => {
    return await session.request("/", { method: "POST", headers: { "Content-Type": "application/json" }, body });
};

const signIn = async (body: string) => {
    const response = await post(body);
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

    it("signs the user in with an access token and a refresh token that name them", async () => {
        const { status, body } = await signIn('{"email":"anna@example.com","password":"severance"}');

        expect(status).toBe(200);
        const { accessToken, refreshToken, user } = body as SessionResponse;
        expect(user).toEqual({ id: "u1", email: "anna@example.com" });
        expect(await verify(accessToken, "test-secret", "HS256")).toMatchObject({ sub: "u1", typ: "access" });
        expect(await verify(refreshToken, "test-secret", "HS256")).toMatchObject({ sub: "u1", typ: "refresh" });
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
            const response = await post(body);

            expect(response.status).toBe(400);
        },
    );

    it("never answers the password or its hash", async () => {
        const { body } = await signIn('{"email":"anna@example.com","password":"severance"}');

        expect(JSON.stringify(body)).not.toContain("severance");
        expect(body).not.toHaveProperty("user.passwordHash");
    });
});

describe("GET /", () => {
    const now = (): number => Math.floor(Date.now() / 1000);
    const token = async (exp: number, secret = "test-secret", typ = "access"): Promise<string> => {
        return await sign({ sub: "u1", email: "anna@example.com", typ, iat: now(), exp }, secret, "HS256");
    };
    const getSession = async (authorization?: string) => {
        const headers = authorization === undefined ? undefined : { Authorization: authorization };
        const response = await session.request("/", { headers });
        return { status: response.status, body: (await response.json()) as unknown };
    };

    beforeEach(() => {
        vi.stubEnv("JWT_SECRET", "test-secret");
        vi.mocked(usersStore.get).mockImplementation(async (id) => {
            return id === "u1"
                ? { id: "u1", email: "anna@example.com", passwordHash: "salt:hash", createdAt: 1 }
                : null;
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
        vi.unstubAllEnvs();
    });

    it("answers the user of a valid token, without the hash", async () => {
        const response = await getSession(`Bearer ${await token(now() + 60)}`);

        expect(response).toEqual({ status: 200, body: { id: "u1", email: "anna@example.com" } });
    });

    it.each([
        ["no token", async () => undefined],
        ["another scheme", async () => `Basic ${await token(now() + 60)}`],
        ["a broken token", async () => "Bearer not.a.token"],
        ["an expired token", async () => `Bearer ${await token(now() - 60)}`],
        ["a token of another secret", async () => `Bearer ${await token(now() + 60, "other-secret")}`],
        ["a refresh token", async () => `Bearer ${await token(now() + 60, "test-secret", "refresh")}`],
    ])("answers 401 to %s", async (_case, authorization) => {
        const { status } = await getSession(await authorization());

        expect(status).toBe(401);
        expect(usersStore.get).not.toHaveBeenCalled();
    });

    it("answers 401 when the account of the token is gone", async () => {
        vi.mocked(usersStore.get).mockResolvedValue(null);

        const { status } = await getSession(`Bearer ${await token(now() + 60)}`);

        expect(status).toBe(401);
    });
});
