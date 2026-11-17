// A UUID, as `crypto.randomUUID()` writes it, in any case.
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// The client id of the `X-Client-Id` header, in lower case, or null when the header is missing or not a UUID.
export const parseClientId = (header: string | undefined): string | null => {
    if (header === undefined || !UUID_PATTERN.test(header)) {
        return null;
    }

    return header.toLowerCase();
};
