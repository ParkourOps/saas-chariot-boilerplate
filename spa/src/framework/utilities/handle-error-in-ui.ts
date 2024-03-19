import type { ToastServiceMethods } from "primevue/toastservice";
import { ApplicationError } from "../libraries/application-error";
import logger from "../libraries/logger";

export default function handleErrorInUI(toast: ToastServiceMethods, error: unknown, genericErrorSummary: string, genericErrorMessage: string) {
    logger.error(error, undefined, {
        genericErrorSummary,
        genericErrorMessage
    });    
    if (error instanceof ApplicationError) {
        toast.add({
            severity: "error",
            summary: genericErrorSummary,
            detail: error.message,
        });
    } else {
        toast.add({
            severity: "error",
            summary: genericErrorSummary,
            detail: genericErrorMessage,
        });
    }
}
