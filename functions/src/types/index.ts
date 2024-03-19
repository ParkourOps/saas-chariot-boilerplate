import { Loggable } from "@/_common_/types/loggable";
import { FunctionsErrorCode } from "firebase-functions/v2/https";

export type CorrelationID<Prefix extends string> = `${Prefix}:${string}`;

type FunctionLoggable<Type extends string, Prefix extends string, TypeData extends object> = Loggable<
    `${Type}@fncs:${Prefix}`,
    TypeData & {
        correlationID: CorrelationID<Prefix>
    }
>;

export type ErrorCode = FunctionsErrorCode;

export type FunctionError<Prefix extends string> = FunctionLoggable<"error", Prefix, {
    code: ErrorCode,
}>;

export type FunctionDebug<Prefix extends string> = FunctionLoggable<"debug", Prefix, {}>;
