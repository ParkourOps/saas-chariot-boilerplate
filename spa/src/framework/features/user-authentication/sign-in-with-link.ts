import SendSignInLink from "@/_common_/features/user-authentication/api/SendSignInLink";
import functionCallerFactory from "@/framework/libraries/function-caller-factory";
import errors from "./types/errors";
import getRouteUrl from "@/framework/utilities/get-route-url";
import type { RouteLocationRaw } from "vue-router/auto";
import localStoreSignInEmail from "./localStoreSignInEmail";
import auth, {isSignInWithEmailLink, signInWithEmailLink} from "../../libraries/_firebase_/auth";
import app, {FirebaseError} from "@/framework/libraries/_firebase_/app";

async function catchSignInWithLinkAttempt() {
    // get address of current page as login link
    const signInLink = window.location.href;
    // try login if link is valid
    if (isSignInWithEmailLink(auth, signInLink)) {
        console.debug("Log in attempt detected...");
        const email = localStoreSignInEmail.get();
        if (!email) {
            // TODO: user signing in from different device, should confirm email to prevent session fixation attacks
            throw errors.signInFromDifferentDeviceNotAllowed;
        }
        try {
            await signInWithEmailLink(auth, email, signInLink);
        } catch (e) {
            if (e instanceof FirebaseError && e.code === "auth/invalid-action-code") {
                throw errors.signInLinkInvalid;
            } else {
                throw e;
            }
        }
    }
}

async function sendSignInLink(email: string, redirect: RouteLocationRaw) {
    const sendSignInLink = functionCallerFactory.createFunctionCaller(SendSignInLink);
    // store email for future use
    localStoreSignInEmail.set(email);
    // get route path
    const redirectUrl = getRouteUrl(redirect);
    // send the link
    await sendSignInLink({
        email,
        redirectUrl
    });
}

function getSignInEmailFromPreviousSignInWithLinkAttempt() {
    return localStoreSignInEmail.get();
}

export default {
    sendSignInLink,
    catchSignInWithLinkAttempt,
    getSignInEmailFromPreviousSignInWithLinkAttempt
};
