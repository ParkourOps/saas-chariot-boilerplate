import {z} from "zod";
import apiCallDeclarator from "../../../libraries/api-call-declarator";
import { EmailAddress, URL } from "../../../models";

export default apiCallDeclarator.declare(
    "sendSignInLink",
    "Send a sign in link to the requesting user's email address.",
    "NO_AUTH",
    z.object({
        email: EmailAddress,
        redirectUrl: URL,
    }),
    z.object({}),
);
