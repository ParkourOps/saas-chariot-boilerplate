import {z} from "zod";
import {DateTime as DateTimeSchema, TimeZone as TimeZoneSchema} from "../models";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import DataInstantiator from "./data-instantiator";
import DataValidator from "./data-validator";
dayjs.extend(advancedFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

type IDateTime = z.infer<typeof DateTimeSchema>;
type TimeZone = z.infer<typeof TimeZoneSchema>;

class DateTime implements IDateTime {
    readonly dayOfMonth;
    readonly month;
    readonly year;
    readonly hours;
    readonly minutes;
    readonly seconds;
    readonly timeZone;
    private readonly instantiator;
    private readonly validator;
    constructor(
        dayOfMonth: number,
        month: number,
        year: number,
        hours: number,
        minutes: number,
        seconds: number,
        tz: TimeZone
    ) {
        this.dayOfMonth = dayOfMonth;
        this.month = month;
        this.year = year;
        this.hours = hours;
        this.minutes = minutes;
        this.seconds = seconds;
        this.timeZone = tz;
        this.instantiator = new DataInstantiator(DateTimeSchema);
        this.validator = new DataValidator(DateTimeSchema);
        this.validator.assertValidity(this);
    }
    toJSON() {
        return this.instantiator.createConst({
            dayOfMonth: this.dayOfMonth,
            month: this.month,
            year: this.year,
            hours: this.hours,
            minutes: this.minutes,
            seconds: this.seconds,
            timeZone: this.timeZone,
        });
    }
    static fromJSON(dateTime: IDateTime) {
        return new DateTime(
            dateTime.dayOfMonth,
            dateTime.month,
            dateTime.year,
            dateTime.hours,
            dateTime.minutes,
            dateTime.seconds ?? 0,
            dateTime.timeZone
        );
    }
    static utcNow() {
        const date = new Date();
        return this.utcFromDate(date);
    }
    toDate() {
        if (this.timeZone === "UTC") {
            return dayjs.utc()
                .year(this.year)
                .month(this.month-1)
                .date(this.dayOfMonth)
                .hour(this.hours)
                .minute(this.minutes)
                .second(this.seconds)
                .toDate();
        } else {
            return dayjs
                .tz(this.timeZone)
                .year(this.year)
                .month(this.month-1)
                .date(this.dayOfMonth)
                .hour(this.hours)
                .minute(this.minutes)
                .second(this.seconds)
                .toDate();
        }
    }
    static utcFromDate(date: Date) {
        return new DateTime(
            date.getUTCDate(),
            date.getUTCMonth() + 1,
            date.getUTCFullYear(),
            date.getUTCHours(),
            date.getUTCMinutes(),
            date.getUTCSeconds(),
            "UTC",
        );
    }
    toUNIX() {
        const date = this.toDate();
        return date.getTime();
    }
    add(value: number, unit: dayjs.ManipulateType) {
        const date = dayjs(this.toDate()).add(value, unit).toDate();
        return DateTime.utcFromDate(date);
    }
    subtract(value: number, unit: dayjs.ManipulateType) {
        const date = dayjs(this.toDate()).subtract(value, unit).toDate();
        return DateTime.utcFromDate(date);
    }
}

export default DateTime;
