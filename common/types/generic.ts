export type Primitive = string | number | boolean | bigint | symbol | undefined | null;

// eslint-disable-next-line @typescript-eslint/ban-types
export type Builtin = Primitive | Function | Date | Error | RegExp;

export type AnyArray<Type = any> = Array<Type> | ReadonlyArray<Type>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IsTuple<Type> = Type extends readonly any[] ? (any[] extends Type ? never : Type) : never;

// https://stackoverflow.com/questions/49927523/disallow-call-with-any/49928360#49928360
export type IsAny<Type> = 0 extends 1 & Type ? true : false;

export type IsUnknown<Type> = IsAny<Type> extends true ? false : unknown extends Type ? true : false;
