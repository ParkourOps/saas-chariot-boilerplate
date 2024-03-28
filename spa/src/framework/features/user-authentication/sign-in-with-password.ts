import auth, {signInWithEmailAndPassword} from "../../libraries/_firebase_/auth";

async function signInWithPassword(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password);    
}

export default signInWithPassword;
