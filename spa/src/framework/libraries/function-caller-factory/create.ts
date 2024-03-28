import functions, { httpsCallable, type HttpsCallableOptions } from "../_firebase_/functions";
import {
    type UnknownKeysParam,
    type ZodRawShape,
    type ZodTypeAny,
    type objectOutputType
} from "zod";
import apiCallDeclarator from "@/_common_/libraries/api-call-declarator";

// export function call<
//     // API call specification
//     CallName extends string,
//     CallDescription extends string,
//     CallRequiresAuth extends "AUTH_REQUIRED" | "NO_AUTH",
//     // request data
//     CallRequestDataShape extends ZodRawShape,
//     CallRequestDataUnknownKeys extends UnknownKeysParam,
//     CallRequestDataCatchAll extends ZodTypeAny,
//     // response data
//     CallResponseDataShape extends ZodRawShape,
//     CallResponseDataUnknownKeys extends UnknownKeysParam,
//     CallResponseDataCatchAll extends ZodTypeAny,
// >(
//     apiCall: ApiCall<
//         CallName,
//         CallDescription,
//         CallRequiresAuth,
//         // request data
//         CallRequestDataShape,
//         CallRequestDataUnknownKeys,
//         CallRequestDataCatchAll,
//         // response data
//         CallResponseDataShape,
//         CallResponseDataUnknownKeys,
//         CallResponseDataCatchAll
//     >,
//     requestData: objectOutputType<CallRequestDataShape, CallRequestDataCatchAll, CallRequestDataUnknownKeys>,
//     callOptions?: HttpsCallableOptions
// ) {
//         return httpsCallable(firebase.funcs, apiCall.name, callOptions)(requestData);
// }

function create<
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
    CallResponseDataCatchAll extends ZodTypeAny
>(
    apiCall: ReturnType<
        typeof apiCallDeclarator.declareAPICall<
            CallName,
            CallDescription,
            CallRequiresAuth,
            CallRequestDataShape,
            CallRequestDataUnknownKeys,
            CallRequestDataCatchAll,
            CallResponseDataShape,
            CallResponseDataUnknownKeys,
            CallResponseDataCatchAll
        >
    >,
    callOptions?: HttpsCallableOptions
) {
    return async function (
        requestData: objectOutputType<
            CallRequestDataShape,
            CallRequestDataCatchAll,
            CallRequestDataUnknownKeys
        >
    ) {
        const rawSuccessResponse = (
            await httpsCallable(functions, apiCall.name, callOptions)(requestData)
        ).data;
        return apiCall.response.parse(rawSuccessResponse);
    };
}

export default create;
