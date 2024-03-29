import {FirebaseError} from "@/framework/libraries/_firebase_/app";
import auth, {GoogleAuthProvider, GithubAuthProvider, TwitterAuthProvider, FacebookAuthProvider, signInWithPopup} from "@/framework/libraries/_firebase_/auth";


const authProviders = {
    google: new GoogleAuthProvider(),
    github: new GithubAuthProvider(),
    twitter: new TwitterAuthProvider(),
    facebook: new FacebookAuthProvider()
} as const;

async function signInWithThirdPartyAccount(provider: keyof typeof authProviders) {
    try {
        await signInWithPopup(auth, authProviders[provider]);
    } catch (e) {
        if (e instanceof FirebaseError && e.code === "auth/popup-closed-by-user") {
            console.debug("Sign in popup closed by user.");
            return;
        }
        throw e;
    }
}

export default signInWithThirdPartyAccount;
