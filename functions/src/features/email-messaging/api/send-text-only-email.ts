import SendTextOnlyEmail from "@/_common_/features/email-messaging/api/SendTextOnlyEmail";
import {sendEmail} from "@/services/sendgrid";
import apiEndpointFactory from "@/libraries/api-endpoint-factory";

export default apiEndpointFactory.createAPIEndpoint(SendTextOnlyEmail)(async (request)=>{
    await sendEmail(request.correlationId, request.data);
    return {};
});
