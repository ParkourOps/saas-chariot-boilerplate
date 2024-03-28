import { ApplicationError } from "@/framework/libraries/application-error";
import type { ZodError } from "node_modules/zod/lib";

export default {
    receivedDocumentInvalid: (path: string, documentData: unknown, validationErrors: ZodError["errors"]) => new ApplicationError(`Invalid document received from path '${path}':`, {
        documentData,
        validationErrors,
    }),
    documentInvalid: (path: string, documentData: unknown, validationErrors: ZodError["errors"]) => new ApplicationError(`Attempt to create or update document in path '${path}' with invalid data:`, {
        documentData,
        validationErrors,
    }),
    
}
