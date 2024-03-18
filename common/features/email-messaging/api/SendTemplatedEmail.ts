import {z} from "zod";
import apiCallDeclarator from "../../../libraries/api-call-declarator";
import { TemplatedEmailSpecification } from "../models";

export default apiCallDeclarator.declare(
    "sendTemplatedEmail",
    "Send an email message using a pre-installed *.mjml template.",
    "NO_AUTH",
    TemplatedEmailSpecification,
    z.object({})
);
