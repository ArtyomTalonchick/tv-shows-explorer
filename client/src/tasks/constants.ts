// Where the app's server answers. The production build calls the Cloud Function on Firebase (the repository variable
// `VITE_API_URL`, passed to the build in `deploy.yml`); in development the variable is not set, and `/api` goes to the
// local server through Vite's proxy.
export const API_URL = `${import.meta.env.VITE_API_URL ?? ""}/api`;
