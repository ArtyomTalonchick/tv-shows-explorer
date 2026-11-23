import { randomBytes, scrypt } from "node:crypto";
import { promisify } from "node:util";

// The bytes of random salt in each hash, and of the key a password is turned into.
const SALT_LENGTH = 16;
const KEY_LENGTH = 64;

const scryptAsync = promisify(scrypt);

// A salted scrypt hash of the password, as `<salt>:<hash>` in hex: a new random salt each time, so two equal
// passwords never give the same hash.
export const hashPassword = async (password: string): Promise<string> => {
    const salt = randomBytes(SALT_LENGTH);
    const hash = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;
    return `${salt.toString("hex")}:${hash.toString("hex")}`;
};
