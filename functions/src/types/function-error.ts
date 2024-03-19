import UniqueIDGenerator from "@/_common_/libraries/unique-id-generator";
import { CorrelationID, ErrorCode, FunctionError as IFunctionError } from "@/types";
import { HttpsError } from "firebase-functions/v2/https";
import express from "express";
import logger from "../libraries/logger";
import { LogDetails, LogMessage } from "@/_common_/types/loggable";

class FunctionError<
    Prefix extends string
> implements IFunctionError<Prefix> {
    readonly type;
    readonly createdAt;
    readonly id;
    readonly correlationID;
    readonly code;
    readonly message;
    readonly details;

    private constructor(
        prefix: Prefix,
        correlationID: CorrelationID<Prefix>,
        code: ErrorCode,
        message: LogMessage,
        details: LogDetails
    ) {
        this.type = `error@fncs:${prefix}` as const;
        const errorIDGenerator = new UniqueIDGenerator(this.type);
        this.id = errorIDGenerator.generate();
        this.correlationID = correlationID;
        this.code = code;
        this.message = message;
        this.details = details;
        this.createdAt = (new Date()).getTime();
    }

    toHTTPErrorResponse() : HttpsError {
        const message = `[${this.correlationID} => ${this.id} => ${this.code}]: An error occurred. See log for details.`;
        return new HttpsError(
            this.code,
            message,
        );
    }

    log() {
        logger.error(this);
    }
    
    send(response: express.Response) {
        const httpsErrorResponse = this.toHTTPErrorResponse();
        response
            .status(httpsErrorResponse.httpErrorCode.status)
            .send(httpsErrorResponse.toJSON())
        ;
    }

    static create<Prefix extends string>(
        prefix: Prefix,
        correlationID: CorrelationID<Prefix>,
        code: ErrorCode,
        message: LogMessage,
        details?: LogDetails
    ) {
        return new FunctionError(prefix, correlationID, code, message, details ?? {});
    }

    static createFromException<Prefix extends string>(
        prefix: Prefix,
        correlationID: CorrelationID<Prefix>,
        e: unknown,
        code: ErrorCode,
        messagePrepend?: LogMessage,
        details?: LogDetails
    ) {
        return this.create(
            prefix,
            correlationID,
            code,
            messagePrepend ? `${messagePrepend}: ${this.extractErrorMessage(e)}` : this.extractErrorMessage(e),
            details
        )
    }

    static extractErrorMessage(error: unknown) {
        if (error instanceof Error) {
            return error.message;
        } else if (typeof error === "string") {
            return error;
        } else {
            return "<Unknown>";
        }
    }
}

export default FunctionError;
