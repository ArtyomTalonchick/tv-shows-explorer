import { PASSWORD_MIN_LENGTH } from "./credentials";

// Whether the password is long enough. It is taken as typed: spaces count.
export const isValidPassword = (password: string): boolean => {
    return password.length >= PASSWORD_MIN_LENGTH;
};
