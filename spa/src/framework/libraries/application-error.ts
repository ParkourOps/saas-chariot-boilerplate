import type { LogDetails, LogMessage } from "@/_common_/types/loggable";

export class ApplicationError extends Error {
    readonly message;
    readonly details;
    constructor(message: LogMessage, details?: LogDetails) {
        super(message);
        this.message = message;
        this.details = details;
    }
}
