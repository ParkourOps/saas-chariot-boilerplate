import SendSignInLink from "@/_common_/features/user-authentication/api/SendSignInLink";
import apiEndpointFactory from "@/libraries/api-endpoint-factory";
import FunctionError from "@/types/function-error";
import {getAuth} from "firebase-admin/auth";
import {sendTemplatedEmail} from "@/services/sendgrid";
import configuration from "@/configuration";

export default apiEndpointFactory.createAPIEndpoint(SendSignInLink)(async (request)=>{
    const auth = getAuth();
    let signInUrl : string;
    try {
        signInUrl = await auth.generateSignInWithEmailLink(request.data.email, {
            url: request.data.redirectUrl,
            // handleCodeInApp: true,
        });
    } catch (e) {
        throw FunctionError.createFromException(
            request.prefix,
            request.correlationId,
            e, 
            "internal", 
            "Could not get sign in link",
            {
                request
            }
        );
    }
    await sendTemplatedEmail(
        request.correlationId,
        {
            to: {
                email: request.data.email,
            },
            from: configuration.project.application.noReplyEmail,
            subject: "Sign In to Your Account",
            templateName: "default",
            templateSubstitutions: {
                title: "Sign In to Your Account",
                paragraph: `Click the button below to sign in to your ${configuration.project.application.title} account:`,
                ctaText: "Sign In",
                ctaLink: signInUrl,
                appName: configuration.project.application.title,
            },
            text:
`
Sign In Link
============

Please sign in using the link below:

${ signInUrl }


Thank you for choosing ${configuration.project.application.title}.
`,
        }
    );
    return {};
});
