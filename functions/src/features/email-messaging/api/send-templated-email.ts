import SendTemplatedEmail from "@/_common_/features/email-messaging/api/SendTemplatedEmail";
import {sendTemplatedEmail} from "@/services/sendgrid";
import apiEndpointFactory from "@/libraries/api-endpoint-factory";

export default apiEndpointFactory.createAPIEndpoint(SendTemplatedEmail)(async (request)=>{
    await sendTemplatedEmail(request.correlationId, request.data);
    return {};
});
