// A whole number from 1, written without a sign, a fraction or leading zeros.
const ID_PATTERN = /^[1-9]\d*$/;

// The show id of a favorites route, or null when the path does not hold one.
export const parseShowId = (param: string): number | null => {
    if (!ID_PATTERN.test(param) || !Number.isSafeInteger(Number(param))) {
        return null;
    }

    return Number(param);
};
