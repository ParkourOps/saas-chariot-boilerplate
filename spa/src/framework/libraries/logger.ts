import type { LogDetails, LogMessage } from "@/_common_/types/loggable";
import type { ApplicationDebug, ApplicationError } from "../types";
import { Logtail } from "@logtail/browser";
import UniqueIDGenerator from "@/_common_/libraries/unique-id-generator";
const logtail = new Logtail(import.meta.env.VITE_BETTERSTACK_SOURCE_TOKEN);

const debugIDGenerator = new UniqueIDGenerator("debug@spa");
const errorIDGenerator = new UniqueIDGenerator("error@spa");

const logger = {
    debug(message: LogMessage, details?: LogDetails) {
        const debugObj = {
            type: "debug@spa",
            id: debugIDGenerator.generateUniqueID(),
            createdAt: new Date().getTime(),
            message,
            details: details ?? {}
        } satisfies ApplicationDebug;
        console.debug(message, debugObj);
        logtail.debug(message, debugObj);
        logtail.flush();
    },

    error(error: unknown, messagePrepend?: string, additionalDetails?: LogDetails) {
        let message;
        let details;
        // parse input
        if (!error) return;
        if (typeof error === "object") {
            const _message = (error as any)?.message;
            const _details = (error as any)?.details;
            const _type = error.constructor.name;
            const _stack = (error as any)?.stack;
            const _code = (error as any)?.code;
            const _customData = (error as any)?.customData;
            message = _message;
            details = {
                ..._details,
                type: _type,
                stack: _stack,
                code: _code,
                customData: _customData
            };
        }
        // prepend message if specified
        if (messagePrepend) {
            message = `${messagePrepend}: ${message}`;
        }
        // append additional details if present
        if (additionalDetails) {
            details = {
                ...details,
                ...additionalDetails
            };
        }
        // produce errorObj
        const errorObj = {
            type: "error@spa",
            id: errorIDGenerator.generateUniqueID(),
            createdAt: new Date().getTime(),
            message,
            details: details ?? {}
        } satisfies ApplicationError;
        // transmit error:
        console.error(message, JSON.stringify(errorObj));
        logtail.error(message, errorObj);
        logtail.flush();
    }
};

export default logger;
