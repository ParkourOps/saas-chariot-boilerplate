// type ServiceFunctionReturn<
//     ServiceName extends string,
//     ServiceDescription extends string,
//     ServiceFunctionReturnData
// > = {
//         success: false,
//         error: ServiceFunctionError<ServiceName, ServiceDescription>
//     } |
//     {
//         success: true,
//         data: 
//     }
// ;

export type ServiceFunction<
    ServiceName extends string,
    ServiceDescription extends string,
    ServiceFoundation,
    ServiceFunctionArgs extends unknown[],
    ServiceFunctionReturnData
> = (
    provider: ()=>ServiceFoundation,
    correlationId: string,
    ...args: ServiceFunctionArgs
) => Promise<ServiceFunctionReturnData>;
