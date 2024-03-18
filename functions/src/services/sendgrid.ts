import serviceFactory from "@/libraries/service-factory";
import configuration from "@/configuration";
import sendgrid from "@sendgrid/mail";
import {z} from "zod";
import {EmailSpecification, TemplatedEmailSpecification} from "@/_common_/features/email-messaging/models";
import {ExpandedEmailAddress} from "@/_common_/models";
// import DateTime from "@/_shared_/libraries/date-time";
import {substitutePreinstalledTemplate} from "./handlebars-template";
import {translateMjmlToHtml} from "./mjml-to-html";
import DateTime from "@/_common_/libraries/date-time";
import ServiceFunctionError from "@/libraries/service-factory/service-function-error";

function parseEmailAddress(input: z.infer<typeof ExpandedEmailAddress>) {
    if (input.displayName) {
        return {
            name: input.displayName,
            email: input.email,
        };
    } else {
        return input.email;
    }
}

function parseEmailAddresses(input: z.infer<typeof ExpandedEmailAddress> | z.infer<typeof ExpandedEmailAddress>[]) {
    if (Array.isArray(input)) {
        return input.map((i)=>parseEmailAddress(i));
    } else {
        return parseEmailAddress(input);
    }
}

const sendgridService = serviceFactory.createService(
    "SendGrid",
    "A service for sending transactional emails via a third-party service (SendGrid).",
    function() {
        // ensure module is initialised with API key
        sendgrid.setApiKey(configuration.functions.services.sendgrid.apiKey);
        // return the initialised module
        return sendgrid;
    }
);

export const sendEmail =
    sendgridService.
        createServiceFunction(async (
            service,
            correlationId,
            messageSpecification: z.infer<typeof EmailSpecification>
        ) => {
            try {
                await service.provider().send({
                    to: parseEmailAddresses(messageSpecification.to),
                    cc: messageSpecification.cc ? parseEmailAddresses(messageSpecification.cc) : undefined,
                    bcc: messageSpecification.bcc ? parseEmailAddresses(messageSpecification.bcc) : undefined,

                    from: parseEmailAddress(messageSpecification.from),
                    replyTo: messageSpecification.replyTo ?
                        parseEmailAddress(messageSpecification.replyTo) : undefined,

                    subject: messageSpecification.subject,
                    sendAt: messageSpecification.sendAt ?
                        DateTime.fromJSON(messageSpecification.sendAt).toUNIX() : undefined,

                    text: messageSpecification.text,
                    html: messageSpecification.html ?? undefined,

                    categories: messageSpecification.categories ?? undefined,
                });
                return undefined;
            } catch (e) {
                throw ServiceFunctionError.createFromException(
                    service.name,
                    service.description,
                    correlationId,
                    e,
                    "internal",
                    "Could not send email message",
                    {
                        messageSpecification
                    }
                );
            }
        });

export const sendTemplatedEmail = sendgridService.createServiceFunction(
    async (
        service,
        correlationId,
        messageSpecification: z.infer<typeof TemplatedEmailSpecification>
    ) => {
        const substitutionResult = await substitutePreinstalledTemplate(
            correlationId,
            `email-templates/${messageSpecification.templateName}.mjml`,
            messageSpecification.templateSubstitutions
        );
        const translationResult = await translateMjmlToHtml(
            correlationId,
            substitutionResult,
        );
        await sendEmail(
            correlationId,
            {
                to: messageSpecification.to,
                cc: messageSpecification.cc,
                bcc: messageSpecification.bcc,

                from: messageSpecification.from,
                replyTo: messageSpecification.from,

                subject: messageSpecification.subject,
                sendAt: messageSpecification.sendAt,

                text: messageSpecification.text,
                html: translationResult,

                categories: messageSpecification.categories,
            }
        );
    }
);
