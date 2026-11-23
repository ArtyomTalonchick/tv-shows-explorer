import { applicationDefault } from "firebase-admin/app";

// Checks that the local server can reach Firestore: the project id is set and Application Default Credentials give
// an access token. Returns what to do when they do not, or null when they do. Not for Cloud Functions, where
// Firebase sets both.
export const checkGoogleCredentials = async (): Promise<string | null> => {
    if (!process.env.GOOGLE_CLOUD_PROJECT) {
        return "GOOGLE_CLOUD_PROJECT is not set: copy server/.env.example to server/.env";
    }

    try {
        await applicationDefault().getAccessToken();
        return null;
    } catch (error) {
        const reason = error instanceof Error ? error.message : String(error);
        return `No Google credentials (${reason}): run \`gcloud auth application-default login\``;
    }
};
