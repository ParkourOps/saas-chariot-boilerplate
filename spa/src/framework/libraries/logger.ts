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
            id: debugIDGenerator.generate(),
            createdAt: (new Date()).getTime(),
            message,
            details: details ?? {},
        } satisfies ApplicationDebug;
        console.debug(message, debugObj);
        logtail.debug(message, debugObj);
        logtail.flush();
    },

    error(message: LogMessage | Error, details?: LogDetails) {
        const errorObj = {
            type: "error@spa",
            id: errorIDGenerator.generate(),
            createdAt: (new Date()).getTime(),
            message: (message instanceof Error) ? message.message : message,
            details: details ?? {},
        } satisfies ApplicationError;
        console.error(message, errorObj);
        logtail.error(message, errorObj);
        logtail.flush();
    }
};

export default logger;
