import {Request, onRequest} from "firebase-functions/v2/https";
import UniqueIdGenerator from "@/_common_/libraries/unique-id-generator";
import FunctionError from "@/types/function-error";

export default function<
    WebhookEndpointName extends string,
    WebhookEndpointDescription extends string,
>(
    name: WebhookEndpointName,
    description: WebhookEndpointDescription,
    handler: (correlationId: string, request: Request) => Promise<void>
) {
    const prefix = `webhookEndpoint:${name}` as const;
    const uniqueIdGenerator = new UniqueIdGenerator(prefix);
    const correlationId = uniqueIdGenerator.generateUniqueID();
    return onRequest(async (request, response) => {
        try {
            await handler(correlationId, request);
            response.status(200).send({});
        } catch (e) {
            if (e instanceof FunctionError) {
                e.log();
                e.send(response);
            } else {
                const err = FunctionError.createFromException(
                    prefix,
                    correlationId,
                    e,
                    "internal",
                    `An unknown error occurred in webhook handler, ${name}`
                );
                err.log();
                err.send(response);
            }
        }
    });
}
