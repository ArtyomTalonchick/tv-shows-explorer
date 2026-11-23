import { scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

// Whether the password is the one `hashPassword` hashed into `stored` (`<salt>:<hash>` in hex). The password is
// hashed with the stored salt to the stored length, and the hashes are compared in constant time, so the time of the
// answer tells nothing of how much matched. A `stored` value of another shape is false.
export const verifyPassword = async (password: string, stored: string): Promise<boolean> => {
    const [saltHex = "", hashHex = ""] = stored.split(":");
    const salt = Buffer.from(saltHex, "hex");
    const expected = Buffer.from(hashHex, "hex");
    if (salt.length === 0 || expected.length === 0) {
        return false;
    }

    const actual = (await scryptAsync(password, salt, expected.length)) as Buffer;
    return timingSafeEqual(actual, expected);
};
