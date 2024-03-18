import {ZodObject, type UnknownKeysParam, type ZodRawShape, type ZodTypeAny} from "zod";

function declare<
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
    name: CallName,
    description: CallDescription,
    authRequired: CallRequiresAuth,
    request: ZodObject<CallRequestDataShape, CallRequestDataUnknownKeys, CallRequestDataCatchAll>,
    response: ZodObject<CallResponseDataShape, CallResponseDataUnknownKeys, CallResponseDataCatchAll>
) {
    return {
        name,
        description,
        authRequired,
        request,
        response,
    };
}

export default {
    declare,
};
