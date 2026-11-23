// The shortest password an account takes; the sign-up form names it in its hint.
export const PASSWORD_MIN_LENGTH = 8;

// Whether the password is long enough. It is taken as typed: spaces count.
export const isValidPassword = (password: string): boolean => {
    return password.length >= PASSWORD_MIN_LENGTH;
};
