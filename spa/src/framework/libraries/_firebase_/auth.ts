import { getAuth } from "firebase/auth";
import app from "./app";

const auth = getAuth(app);

export { isSignInWithEmailLink, signInWithEmailLink, onAuthStateChanged, signOut, type User } from "firebase/auth";
export default auth;
