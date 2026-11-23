// Something, an `@`, a domain with a dot: `anna@example` is not an email, `anna@example.com` is. No `/`: the server
// keeps a user under its email, and a `/` would split that path.
const EMAIL_PATTERN = /^[^\s@/]+@[^\s@/]+\.[^\s@/]+$/;

// Whether the email, without its outer spaces, looks like `name@example.com`.
export const isValidEmail = (email: string): boolean => {
    return EMAIL_PATTERN.test(email.trim());
};
