import {z} from "zod";
import apiCallDeclarator from "../../../libraries/api-call-declarator";
import { TextOnlyEmailSpecification } from "../models";

export default apiCallDeclarator.declareAPICall(
    "sendTextOnlyEmail",
    "Send a simple text-only email message.",
    "NO_AUTH",
    TextOnlyEmailSpecification,
    z.object({})
);
