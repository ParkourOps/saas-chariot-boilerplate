/* For converting nested object to flat objects with dot notation paths: */

import type { Primitive as _Primitive } from "./generic";

type Primitive = Exclude<_Primitive, symbol>;

type KeyOfObject<T> = Extract<keyof T, string>;

type Dot<T extends string, U extends string> = "" extends U ? T : `${T}.${U}`;

type PathsToProps<T, V> = T extends V ? "" : {
    [K in KeyOfObject<T>]: Dot<K, PathsToProps<T[K], V>>
}[KeyOfObject<T>];

export type ObjToDotNotation<T> = {
    [K in PathsToProps<T, Primitive>]: Primitive
}
