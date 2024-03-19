import type { LogDetails, LogMessage } from "@/_common_/types/loggable";
import logger from "./logger";

export class ApplicationError extends Error {
    readonly message;
    readonly details;
    constructor(message: LogMessage, details?: LogDetails) {
        super(message);
        this.message = message;
        this.details = details;
    }
    log() {
        logger.error(this);
    }
}