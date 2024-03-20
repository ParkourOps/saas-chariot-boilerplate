import app from "./app";
import { getAnalytics } from "firebase/analytics";

const analytics = getAnalytics(app);

export default analytics;
