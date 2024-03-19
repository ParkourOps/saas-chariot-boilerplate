export type LogMessage = string;
export type LogDetails = Record<string | number, unknown>;

export type Loggable<Type extends string, TypeData extends object> = {
    type: Type
    id: `${Type}:${string}`
    createdAt: number,
    message: LogMessage,
    details: LogDetails,
} & TypeData;
