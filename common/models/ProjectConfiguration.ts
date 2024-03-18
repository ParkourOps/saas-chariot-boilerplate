import { z } from "zod";
import { ExpandedEmailAddress, NonEmptyString, Time, URL, WGS84DecimalCoordinate, Boolean, Color } from ".";
import TimeZone from "./TimeZone";


const DayOfficeHours = z.object({
    from: Time.omit({timeZone: true}),
    to: Time.omit({timeZone: true}),
});


const ApplicationConfiguration = z.object({
    title: NonEmptyString.max(70),
    subtitle: NonEmptyString.nullish(),
    noReplyEmail: ExpandedEmailAddress,
});


const SEOConfiguration = z.object({
    description: NonEmptyString.max(200),
    featuredImage: z.object({
        url: URL,
        alt: NonEmptyString,
        enlargedPreview: Boolean.nullish(),
    }).nullish(),
    featuredVideo: z.object({
        url: URL,
        alt: NonEmptyString,
    }).nullish(),
    featuredAudio: z.object({
        url: URL,
    }).nullish(),
    themeColor: Color,
    preferredColorScheme: z.union([
        z.literal("light"),
        z.literal("dark"),
    ]),
});


const ContactInformation = z.object({
    company: z.object({
        name: NonEmptyString.nullish(),
        number: NonEmptyString.nullish(),
    }).nullish(),

    phone: NonEmptyString.nullish(),
    email: ExpandedEmailAddress,

    address: z.object({
        lines: NonEmptyString.array(),
        geolocation: WGS84DecimalCoordinate.nullish(),
        timeZone: TimeZone,
    }).nullish(),

    officeHours: z.object({
        monday: DayOfficeHours.nullish(),
        tuesday: DayOfficeHours.nullish(),
        wednesday: DayOfficeHours.nullish(),
        thursday: DayOfficeHours.nullish(),
        friday: DayOfficeHours.nullish(),
        saturday: DayOfficeHours.nullish(),
        sunday: DayOfficeHours.nullish(),
    }).nullish(),
});


export default z.object({
    application: ApplicationConfiguration,
    seo: SEOConfiguration,
    contact: ContactInformation
});
