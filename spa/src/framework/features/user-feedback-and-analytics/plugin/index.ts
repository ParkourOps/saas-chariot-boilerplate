import posthog from 'posthog-js'
import { watch, type App } from "vue";
import { useUserAuthentication, type User } from "../../user-authentication";
import getAppMode from "@/framework/utilities/get-app-mode";
import { captureEvent } from '../capture-event';

export default {
    install(app: App) {
        // initialise posthog
        posthog.init(import.meta.env.VITE_POSTHOG_PROJECT_API_KEY, {
            api_host: "https://eu.posthog.com",
            capture_pageview: false,
            autocapture: false,
        });

        // enable debug log if running locally
        if (getAppMode() === "development") {
            posthog.debug();
        }

        // update identity if active user detected / reset identity if logged out
        const userAuthentication = useUserAuthentication();
        watch(()=>userAuthentication.activeUser, (currUser, prevUser)=>{
            updateIdentity(currUser, prevUser);
        }, {immediate: true});

        // provide captureEvent function inside Vue templates
        app.config.globalProperties.$captureEvent = captureEvent;

        // prompt
        console.debug("User Feedback and Analytics installed.");
    }
}

export function updateIdentity(currUser: User | null | undefined, prevUser: User | null | undefined) {
    if (currUser && typeof currUser === "object") {
        // set analytics identity
        posthog.identify(currUser.uid, {
            email: currUser.email,
            emailVerified: currUser.emailVerified,
        });
        // capture sign in event
        captureEvent("user-signed-in", currUser.uid);
    } else if (currUser === null) {
        // capture sign out event, if a user was previously logged in
        if (prevUser && typeof prevUser === "object") {
            captureEvent("user-signed-out", prevUser.uid);
        }
        // reset analytics identity ∵ no user
        posthog.reset();
    } else {
        // do nothing ∵ user var is in pending state
    }
}

declare module "vue" {
    interface ComponentCustomProperties {
        $captureEvent: typeof captureEvent;
    }
}
