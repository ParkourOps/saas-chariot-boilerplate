import {auth, app} from "../../libraries/_firebase_";

const authProviders = {
  google: new auth.GoogleAuthProvider(),
  github: new auth.GithubAuthProvider(),
  twitter: new auth.TwitterAuthProvider(),
  facebook: new auth.FacebookAuthProvider(),
} as const;

async function signInWithThirdPartyAccount(provider: keyof typeof authProviders) {
  try {
    await auth.signInWithPopup(auth.default, authProviders[provider]);
  } catch (e) {
    if (e instanceof app.FirebaseError && e.code === "auth/popup-closed-by-user") {
      console.debug("Sign in popup closed by user.");
      return;
    };
    throw e;
  }
}

export default signInWithThirdPartyAccount;
