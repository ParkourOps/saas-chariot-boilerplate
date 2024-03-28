import localStoreSignInEmail from "./localStoreSignInEmail";
import auth, {type User, onAuthStateChanged} from "../../libraries/_firebase_/auth";
import { defineStore } from "pinia";
import { ref } from "vue";

export async function signOut() {
    console.debug("Logging out...");
    localStoreSignInEmail.set();
    await auth.signOut();
}
export {default as signInWithLink} from "./sign-in-with-link";
export {default as signInWithThirdPartyAccount} from "./sign-in-with-third-party-account";
export {default as signInWithPassword} from "./sign-in-with-password";
export {type User} from "../../libraries/_firebase_/auth";

export const useUserAuthentication = defineStore("User Authentication", () => {
    // Tri-state: undefined is pending, null is no user; user present if logged in
    const activeUser = ref<User | null | undefined>(undefined);

    // Listen on Firebase Auth's internal change and reflect in activeUser.
    const router = useRouter();
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            if (activeUser.value) {
                console.debug("Logged out.");
                router.push({ name: "/sign-in" });
            }
            activeUser.value = null;
        } else {
            activeUser.value = user;
            console.debug("Logged in: " + user.email);
            router.push({ name: "/" });
        }
    });

    return {
        activeUser
    };
});
