// The email as the server keeps and compares it: without outer spaces and in lower case.
export const normalizeEmail = (email: string): string => {
    return email.trim().toLowerCase();
};
