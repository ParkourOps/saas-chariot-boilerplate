import { FunctionDebug, FunctionError } from "@/types";
import { debug as _debug, log as _log, info as _info, warn as _warn, error as _error } from "firebase-functions/logger";
import { Logtail } from "@logtail/node";
import configuration from "@/configuration";
const logtail = new Logtail(configuration.functions.services.betterstack.sourceToken);

const logger = {
    debug<Prefix extends string>(debugObj: FunctionDebug<Prefix>) {
        // const message = `[${debugObj.correlationID} => ${debugObj.id}]: ${debugObj.data.message}`;
        const message = debugObj.data.message;
        _debug(message, debugObj);
        logtail.debug(message, debugObj);
        logtail.flush();
    },

    error<Prefix extends string>(errorObj: FunctionError<Prefix>) {
        // const message = `[${errorObj.correlationID} => ${errorObj.id} => ${errorObj.data.code}]: ${errorObj.data.message}`;
        const message = errorObj.data.message;
        _error(message, errorObj);
        logtail.error(message, errorObj);
        logtail.flush();
    }
};

export default logger;
