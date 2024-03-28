import { getFirestore } from "firebase/firestore";
import app from "./app";

// Initialize Firebase Firestore
const firestore = getFirestore(app);
export default firestore;
