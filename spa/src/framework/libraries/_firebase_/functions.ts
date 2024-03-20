import app from "./app";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

const functions = getFunctions(app);

(() => {
    const useEmulator = import.meta.env.VITE_FIREBASE_USE_EMULATOR;
    if (/(true|yes|t|y)/i.test(useEmulator)) {
        connectFunctionsEmulator(functions, "127.0.0.1", 5001);
        console.debug("Connected to local Firebase emulator.");
    }
})();

export default functions;
export { httpsCallable, type HttpsCallableOptions } from "firebase/functions";
