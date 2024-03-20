import type { Loggable } from "@/_common_/types/loggable";

type ApplicationLoggable<Type extends string, TypeData extends object> = Loggable<
    `${Type}@spa`,
    TypeData
>;

export type ApplicationError = ApplicationLoggable<"error", {}>;
export type ApplicationDebug = ApplicationLoggable<"debug", {}>;
