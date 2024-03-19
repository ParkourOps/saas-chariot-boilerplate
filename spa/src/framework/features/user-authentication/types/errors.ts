import { ApplicationError } from "@/framework/libraries/application-error";

export const errorSignInFromDifferentDeviceNotAllowed = new ApplicationError("Signing in from a device other than the one that requested the sign in link is not allowed.");
export const errorSignInLinkInvalid = new ApplicationError("The sign in link you used is invalid. Please try again and get in touch if this error persists.");
export const errorFailedToGetSignInLink = new ApplicationError("Something went wrong while trying to send your sign in link (probably on our side). Please try again and get in touch if this error persists.");
