import { verify } from "hono/jwt";
import type { SessionResponse } from "@tv-shows-explorer/shared";
import { usersStore } from "~/routes/_stores/usersStore/usersStore";
import { users } from "../users";

vi.mock("~/routes/_stores/usersStore/usersStore", () => {
    return { usersStore: { create: vi.fn(), get: vi.fn(), findByEmail: vi.fn() } };
});

const STORED = { id: "u1", email: "anna@example.com", passwordHash: "salt:hash", createdAt: 1 };

const post = async (body: string) => {
    return await users.request("/", { method: "POST", headers: { "Content-Type": "application/json" }, body });
};

const signUp = async (body: string) => {
    const response = await post(body);
    return { status: response.status, body: (await response.json()) as unknown };
};

describe("POST /", () => {
    beforeEach(() => {
        vi.stubEnv("JWT_SECRET", "test-secret");
        vi.mocked(usersStore.findByEmail).mockResolvedValue(null);
    });

    afterEach(() => {
        vi.resetAllMocks();
        vi.unstubAllEnvs();
    });

    it("makes an account and answers an access token and a refresh token that name it", async () => {
        const { status, body } = await signUp('{"email":"  Anna@Example.com ","password":"severance"}');

        expect(status).toBe(201);
        const { accessToken, refreshToken, user } = body as SessionResponse;
        expect(user).toEqual({ id: expect.any(String), email: "anna@example.com" });
        expect(await verify(accessToken, "test-secret", "HS256")).toMatchObject({ sub: user.id, typ: "access" });
        expect(await verify(refreshToken, "test-secret", "HS256")).toMatchObject({ sub: user.id, typ: "refresh" });
    });

    it("looks the email up normalized, and keeps it with a hash, never the password", async () => {
        await signUp('{"email":"Anna@Example.com","password":"severance"}');

        expect(usersStore.findByEmail).toHaveBeenCalledWith("anna@example.com");
        const stored = vi.mocked(usersStore.create).mock.calls[0]?.[0];
        expect(stored).toMatchObject({ email: "anna@example.com", createdAt: expect.any(Number) });
        expect(JSON.stringify(stored)).not.toContain("severance");
    });

    it("answers 409 when the email already has an account, and makes none", async () => {
        vi.mocked(usersStore.findByEmail).mockResolvedValue(STORED);

        const { status, body } = await signUp('{"email":"Anna@Example.com","password":"severance"}');

        expect(status).toBe(409);
        expect(body).toEqual({ error: "This email already has an account" });
        expect(usersStore.create).not.toHaveBeenCalled();
    });

    it.each([
        "not json",
        '{"email":"anna@example.com"}',
        '{"email":"anna@example","password":"severance"}',
        '{"email":"anna@example.com","password":"dark"}',
    ])("answers 400 to %j and makes no account", async (body) => {
        const response = await post(body);

        expect(response.status).toBe(400);
        expect(usersStore.create).not.toHaveBeenCalled();
    });

    it("answers 400 with what is wrong, in the words of the schema", async () => {
        const { body } = await signUp('{"email":"anna@example.com","password":"dark"}');

        expect(body).toEqual({ error: expect.stringContaining("password") });
    });

    it("answers 400 to a body sent without the JSON Content-Type", async () => {
        const body = '{"email":"anna@example.com","password":"severance"}';
        const response = await users.request("/", { method: "POST", body });

        expect(response.status).toBe(400);
        expect(usersStore.create).not.toHaveBeenCalled();
    });

    it("never answers the password", async () => {
        const { body } = await signUp('{"email":"anna@example.com","password":"severance"}');

        expect(JSON.stringify(body)).not.toContain("severance");
    });
});
