import { ApplicationError } from "@/framework/libraries/application-error";

export const errorSignInFromDifferentDeviceNotAllowed = new ApplicationError("Signing in from a device other than the one that requested the link is not allowed.");
export const errorSignInLinkInvalid = new ApplicationError("The link you used to sign in has either expired or is invalid. Please try again and get in touch if this error persists.");
