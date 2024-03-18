import { FunctionsErrorCode } from "firebase-functions/v2/https";

export type CorrelationID<Prefix extends string> = `${Prefix}:${string}`;

type FunctionLoggable<Type extends string, Prefix extends string, TypeData extends object | null> = Loggable<`${Type}:fncs:${Prefix}`, TypeData> & {
    correlationID: CorrelationID<Prefix>
}

export type ErrorCode = FunctionsErrorCode;
export type ErrorMessage = string;
export type ErrorDetails = Record<string | number, unknown>;

export type FunctionError<Prefix extends string> = FunctionLoggable<"error", Prefix, {
    code: ErrorCode,
    message: ErrorMessage,
    details: ErrorDetails,
}>;

export type DebugMessage = string;
export type DebugDetails = Record<string | number, unknown>;

export type FunctionDebug<Prefix extends string> = FunctionLoggable<"debug", Prefix, {
    message: DebugMessage,
    details: DebugDetails
}>;
