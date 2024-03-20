import type { Primitive } from "../../../types/generic";

type EventProperties = {
    [key: string]: EventProperties | Exclude<Primitive, symbol>
}

export type EventsDictionary = {
    [eventName: string]: (...args: any[]) => EventProperties
}
