import {onCall} from "firebase-functions/v2/https";
import {UnknownKeysParam, ZodRawShape, ZodTypeAny, objectOutputType} from "zod";
import ApiCallDeclarator from "@/_common_/libraries/api-call-declarator";
import { CorrelationID } from "@/types";
import UniqueIDGenerator from "@/_common_/libraries/unique-id-generator";
import FunctionError from "@/types/function-error";

type RequestAuth = {
    user: {
        id: string,
        email: string,
    }
};

type HandlerRequestAuth<CallRequiresAuth extends "AUTH_REQUIRED" | "NO_AUTH"> =
    CallRequiresAuth extends "AUTH_REQUIRED" ? RequestAuth : (RequestAuth | undefined)
;

export default function<
    // API call specification
    CallName extends string,
    CallDescription extends string,
    CallRequiresAuth extends "AUTH_REQUIRED" | "NO_AUTH",
    // request data
    CallRequestDataShape extends ZodRawShape,
    CallRequestDataUnknownKeys extends UnknownKeysParam,
    CallRequestDataCatchAll extends ZodTypeAny,
    // response data
    CallResponseDataShape extends ZodRawShape,
    CallResponseDataUnknownKeys extends UnknownKeysParam,
    CallResponseDataCatchAll extends ZodTypeAny,
>(
    specification: ReturnType<typeof ApiCallDeclarator.declare<
        CallName,
        CallDescription,
        CallRequiresAuth,
        CallRequestDataShape,
        CallRequestDataUnknownKeys,
        CallRequestDataCatchAll,
        CallResponseDataShape,
        CallResponseDataUnknownKeys,
        CallResponseDataCatchAll
    >>
) {
    const prefix = `apiCall:${specification.name}` as const;
    return function(
        handler: (
            request: {
                prefix: typeof prefix,
                correlationId: CorrelationID<`apiCall:${CallName}`>,
                info: {
                    name: CallName,
                    description: CallDescription,
                },
                data: objectOutputType<
                    CallRequestDataShape,
                    CallRequestDataCatchAll,
                    CallRequestDataUnknownKeys
                >,
                auth: HandlerRequestAuth<CallRequiresAuth>
            }
        ) => Promise<objectOutputType<CallResponseDataShape, CallResponseDataCatchAll, CallResponseDataUnknownKeys>>
    ) {
        return onCall<
            objectOutputType<
                CallRequestDataShape,
                CallRequestDataCatchAll,
                CallRequestDataUnknownKeys
            >
        >(async (request) => {
            const generator = new UniqueIDGenerator(prefix);
            const correlationId = generator.generate();
            const loggableRequest = (r: typeof request) => ({
                auth: request.auth,
                data: request.data
            });
            try {
                // check if authorised
                if (
                    (specification.authRequired === "AUTH_REQUIRED") &&
                    (!request.auth || !request.auth.token.email || !request.auth.token.email_verified)
                ) {
                    throw FunctionError.create(
                        prefix,
                        correlationId,
                        "unauthenticated",
                        "Only authorised users with a verified email address can make this request.",
                        {
                            request: loggableRequest(request)
                        }
                    );
                }
                // parse request
                const requestParseResult = specification.request.safeParse(request.data);
                if (!requestParseResult.success) {
                    throw FunctionError.create(
                        prefix,
                        correlationId,
                        "invalid-argument",
                        "Request is invalid. Could not parse request data.",
                        {
                            request: loggableRequest(request),
                            parseErrors: requestParseResult.error.errors,
                        }
                    )
                }
                const requestData = requestParseResult.data;
                // call the handler
                const responseData = await handler(
                    {
                        prefix,
                        correlationId,
                        info: {
                            name: specification.name,
                            description: specification.description,
                        },
                        data: requestData,
                        auth: specification.authRequired === "AUTH_REQUIRED" ?
                            (({
                                user: {
                                    id: request.auth?.uid ?? "",
                                    email: request.auth?.token.email ?? "",
                                },
                            }) as HandlerRequestAuth<CallRequiresAuth>) :
                            (request.auth ? ({
                                user: {
                                    id: request.auth?.uid ?? "",
                                    email: request.auth?.token.email ?? "",
                                },
                            }) : undefined as HandlerRequestAuth<CallRequiresAuth>),
                    },
                );
                const responseParseResult = specification.response.safeParse(responseData);
                if (!responseParseResult.success) {
                    throw FunctionError.create(
                        prefix,
                        correlationId,
                        "internal",
                        "Response is invalid. Could not parse response data.",
                        {
                            responseData,
                            parseErrors: responseParseResult.error.errors,
                        }
                    )
                } else {
                    return responseParseResult.data;
                }
            } catch (err) {
                if (err instanceof FunctionError) {
                    err.log();
                    throw err.toHTTPErrorResponse();
                } else {
                    const fnErr = FunctionError.createFromException(
                        prefix,
                        correlationId,
                        err,
                        "internal",
                        `An unknown error occurred in API call, ${specification.name}`
                    );
                    fnErr.log();
                    throw fnErr.toHTTPErrorResponse();
                }
            }
        });
    };
}
