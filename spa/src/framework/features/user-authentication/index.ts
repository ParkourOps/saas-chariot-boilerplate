import { onAuthStateChanged, signOut as _signOut, type User } from "firebase/auth";
import localStoreSignInEmail from "./localStoreSignInEmail";
import signInWithLink from "./sign-in-with-link"
import auth from "@/framework/libraries/_firebase_/auth";
import { defineStore } from "pinia";
import { ref } from "vue";

async function signOut() {
    console.debug("Logging out...");
    localStoreSignInEmail.set();
    await _signOut(auth);
}

export const useUserAuthentication = defineStore("User Authentication", ()=>{
    // Tri-state: undefined is pending, null is no user; user present if logged in
    const activeUser = ref<User|null|undefined>(undefined);

    // Listen on Firebase Auth's internal change and reflect in activeUser.
    const router = useRouter();
    onAuthStateChanged(auth, (user) => {
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
        signInWithLink: signInWithLink,
        signOut,
        activeUser
    }
});
