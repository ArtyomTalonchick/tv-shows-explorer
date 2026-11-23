// Where the app's server answers: `/api` on the app's own domain. In production Firebase Hosting hands `/api/**` to
// the Cloud Function (`firebase.json`); in development Vite's proxy hands it to the local server.
export const API_URL = "/api";
