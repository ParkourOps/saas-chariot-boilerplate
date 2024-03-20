import localStoreSignInEmail from "./localStoreSignInEmail";
import signInWithLink from "./sign-in-with-link"
import {auth} from "../../libraries/_firebase_";
import { defineStore } from "pinia";
import { ref } from "vue";
import signInWithThirdPartyAccount from "./sign-in-with-third-party-account";
import errors from "./types/errors";

export type User = auth.User;

async function signOut() {
    console.debug("Logging out...");
    localStoreSignInEmail.set();
    await auth.signOut(auth.default);
}

export const useUserAuthentication = defineStore("User Authentication", ()=>{
    // Tri-state: undefined is pending, null is no user; user present if logged in
    const activeUser = ref<User|null|undefined>(undefined);

    // Listen on Firebase Auth's internal change and reflect in activeUser.
    const router = useRouter();
    auth.onAuthStateChanged(auth.default, (user) => {
        if (!user) {
            if (activeUser.value) {
                console.debug("Logged out.");
                router.push({name: '/sign-in'});
            }
            activeUser.value = null;
        } else {
            activeUser.value = user;
            console.debug("Logged in: " + user.email);
            router.push({name: '/'});
        }
    });

    return {
        signInWithLink,
        signInWithThirdPartyAccount,
        signOut,
        activeUser,
    }
});
