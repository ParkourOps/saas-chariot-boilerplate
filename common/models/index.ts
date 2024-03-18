import {z} from "zod";
import {default as _TimeZone_} from "./TimeZone";

export const Boolean = z.boolean();

export const Integer = z.number().int();
export const NonNegativeInteger = Integer.gte(0);

export const Decimal = z.number();
export const NonNegativeDecimal = Decimal.gte(0);

export const NonEmptyString = z.string().min(1);

export const Colour = NonEmptyString.regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/);
export const AlphaColour = NonEmptyString.regex(/^#(?:[0-9a-fA-F]{3,4}){1,2}$/);

export const URL = z.string().url();
export const UUID = z.string().uuid();

export const EmailAddress= z.string().email();
export const ExpandedEmailAddress = z.object({
    email: EmailAddress,
    displayName: NonEmptyString.nullish(),
});

export const ISO8601Timestamp = z.string().datetime();

export const Metadata = z.record(z.string(), z.union([
    z.string(),
    z.number(),
    z.null(),
]));

export const WGS84DecimalCoordinate = z.object({
    latitude: Decimal.gte(-90).lte(90),
    longitude: Decimal.gte(-180).lte(180),
});

// export const DayOfWeek = z.union([
//     z.literal("Monday"),
//     z.literal("Tuesday"),
//     z.literal("Wednesday"),
//     z.literal("Thursday"),
//     z.literal("Friday"),
//     z.literal("Saturday"),
//     z.literal("Sunday"),
// ]);

// export const Month = z.union([
//     z.literal("January"),
//     z.literal("February"),
//     z.literal("March"),
//     z.literal("April"),
//     z.literal("May"),
//     z.literal("June"),
//     z.literal("July"),
//     z.literal("August"),
//     z.literal("September"),
//     z.literal("October"),
//     z.literal("November"),
//     z.literal("December"),
// ]);

export const TimeZone = _TimeZone_;
export const Date = z.object({
    dayOfMonth: NonNegativeInteger.gte(1).lte(31),
    month: NonNegativeInteger.gte(1).lte(12),
    year: NonNegativeInteger,
    timeZone: TimeZone,
});
export const Time = z.object({
    hours: NonNegativeInteger.lte(23),
    minutes: NonNegativeInteger.lte(59),
    seconds: NonNegativeInteger.lte(59),
    timeZone: TimeZone,
});
export const DateTime = Date.merge(Time);

/*
    * one lowercase letter: a-z
    * one uppercase letter: A-Z
    * one digit: 0-9
    * one symbol: ^ $ * . [ ] { } ( ) ? " ! @ # % & / \ , > < ' : ; | _ ~ `
*/
export const Password = z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{6,4096}$/);
