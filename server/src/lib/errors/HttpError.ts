// A request answered with a non-2xx status: the caller can tell «not found» (404) from a failure by `status`.
export class HttpError extends Error {
    readonly status: number;

    constructor(status: number) {
        super(`Request failed with status ${status}`);
        this.name = "HttpError";
        this.status = status;
    }
}
