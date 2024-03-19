import { CorrelationID } from "@/types";
import ServiceFunctionError from "./service-function-error";
import FunctionError from "@/types/function-error";

export type ServiceFunction<
    ServiceName extends string,
    ServiceDescription extends string,
    ServiceFoundation,
    ServiceFunctionArgs extends unknown[],
    ServiceFunctionReturnData
> = (
    service: {
        name: ServiceName,
        description: ServiceDescription,
        provider: ()=>ServiceFoundation
    },
    correlationId: CorrelationID<any>,
    ...args: ServiceFunctionArgs
) => Promise<ServiceFunctionReturnData>;

export default function<
    ServiceName extends string,
    ServiceDescription extends string,
    ServiceFoundation
>(
    name: ServiceName,
    description: ServiceDescription,
    provider: ()=>ServiceFoundation
) {
    return {
        name,
        description,
        get service() {
            return provider();
        },
        createServiceFunction<
            ServiceFunctionArgs extends unknown[],
            ServiceFunctionReturnData
        >(
            fn: ServiceFunction<
                ServiceName,
                ServiceDescription,
                ServiceFoundation,
                ServiceFunctionArgs,
                ServiceFunctionReturnData
            >
        ) {
            return async function(
                correlationId: CorrelationID<any>,
                ...args: ServiceFunctionArgs
            ) : Promise<ServiceFunctionReturnData> {
                try {
                    return await fn(
                        {provider, name, description}, correlationId, ...args
                    );
                } catch (e) {
                    if (e instanceof FunctionError) {
                        throw e;
                    } else {
                        throw ServiceFunctionError.createFromException(
                            name,
                            description,
                            correlationId,
                            e,
                            "internal",
                            `An unknown error was caught in ${name} service`
                        );
                    }
                }
            };
        },
    };
}
