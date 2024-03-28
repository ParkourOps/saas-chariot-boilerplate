import { getAuth } from "firebase/auth";
import app from "./app";

export {
    isSignInWithEmailLink,
    signInWithEmailLink,
    onAuthStateChanged,
    signOut,
    type User,
    GoogleAuthProvider,
    GithubAuthProvider,
    signInWithPopup,
    TwitterAuthProvider,
    FacebookAuthProvider,
    signInWithEmailAndPassword,
} from "firebase/auth";

// Initialize Firebase Auth 
const auth = getAuth(app);
export default auth;
