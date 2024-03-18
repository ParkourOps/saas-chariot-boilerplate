import { CorrelationID, ErrorCode, ErrorDetails, ErrorMessage } from "@/types";
import FunctionError from "@/types/function-error";

type ServiceFunctionErrorDetails<
    ServiceName extends string,
    ServiceDescription extends string,
> = ErrorDetails & {
    service: {
        name: ServiceName,
        description: ServiceDescription,
    }
};

export default class ServiceFunctionError {
    static create<
        ServiceName extends string,
        ServiceDescription extends string,
    >(
        serviceName: ServiceName,
        serviceDescription: ServiceDescription,
        correlationID: CorrelationID<any>,
        code: ErrorCode,
        message: ErrorMessage,
        details?: ErrorDetails
    ) {
        return FunctionError.create(
            `service:${serviceName}`,
            correlationID,
            code,
            message,
            {
                service: {
                    name: serviceName,
                    description: serviceDescription,
                },
                ...details
            } satisfies ServiceFunctionErrorDetails<ServiceName, ServiceDescription>
        );
    }

    static createFromException<
        ServiceName extends string,
        ServiceDescription extends string,
    >(
        serviceName: ServiceName,
        serviceDescription: ServiceDescription,
        correlationID: CorrelationID<any>,
        e: unknown,
        code: ErrorCode,
        messagePrepend?: ErrorMessage,
        details?: ErrorDetails
    ) {
        return this.create(
            serviceName,
            serviceDescription,
            correlationID,
            code,
            messagePrepend ? `${messagePrepend}: ${FunctionError.extractErrorMessage(e)}` : FunctionError.extractErrorMessage(e),
            details,
        )
    }
}
