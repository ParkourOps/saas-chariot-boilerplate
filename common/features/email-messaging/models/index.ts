import {NonEmptyString, ExpandedEmailAddress, DateTime} from "../../../models";
import {z} from "zod";

const BaseEmailSpecification = z.object({
    to: ExpandedEmailAddress.or(ExpandedEmailAddress.array()),
    cc: ExpandedEmailAddress.or(ExpandedEmailAddress.array()).nullish(),
    bcc: ExpandedEmailAddress.or(ExpandedEmailAddress.array()).nullish(),

    from: ExpandedEmailAddress,
    replyTo: ExpandedEmailAddress.nullish(),

    subject: NonEmptyString,
    sendAt: DateTime.nullish(),

    categories: NonEmptyString.array().nullish(),
});

export const EmailSpecification = BaseEmailSpecification.merge(z.object({
    text: NonEmptyString,
    html: NonEmptyString.nullish(),
}));

export const TemplatedEmailSpecification = BaseEmailSpecification.merge(z.object({
    text: NonEmptyString,
    templateName: NonEmptyString,
    templateSubstitutions: z.record(z.string(), z.unknown()),
}));

export const TextOnlyEmailSpecification = BaseEmailSpecification.merge(z.object({
    text: NonEmptyString,
}));
