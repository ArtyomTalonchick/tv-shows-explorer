import { checkGoogleCredentials } from "../checkGoogleCredentials";

const { getAccessToken } = vi.hoisted(() => {
    return { getAccessToken: vi.fn() };
});

vi.mock("firebase-admin/app", () => {
    return { applicationDefault: () => ({ getAccessToken }) };
});

describe("checkGoogleCredentials", () => {
    beforeEach(() => {
        vi.stubEnv("GOOGLE_CLOUD_PROJECT", "tv-shows-explorer");
        getAccessToken.mockResolvedValue({ access_token: "token", expires_in: 3600 });
    });

    afterEach(() => {
        vi.unstubAllEnvs();
        vi.resetAllMocks();
    });

    it("finds nothing to do with a project id and credentials", async () => {
        expect(await checkGoogleCredentials()).toBeNull();
    });

    it("asks for the env file when the project id is not set", async () => {
        vi.stubEnv("GOOGLE_CLOUD_PROJECT", "");

        expect(await checkGoogleCredentials()).toContain("copy server/.env.example to server/.env");
        expect(getAccessToken).not.toHaveBeenCalled();
    });

    it("says what to run, and why, when there are no credentials", async () => {
        getAccessToken.mockRejectedValue(new Error("Could not load the default credentials"));

        const problem = await checkGoogleCredentials();

        expect(problem).toContain("Could not load the default credentials");
        expect(problem).toContain("gcloud auth application-default login");
    });
});
