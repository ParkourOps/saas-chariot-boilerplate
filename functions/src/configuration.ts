import {Int, String, configVar, createConfig, fromEnv, fromVal} from "@parkour-ops/application-configuration";
import projectConfiguration from "./_common_/data/projectConfiguration";

// Required for Functions emulator.
// Ensures .env file is loaded.
import {config} from "dotenv";
config({ path: `.env.${process.env.GCLOUD_PROJECT}`});

// Define the config:
const functionsConfiguration = createConfig({
    services: {
        sendgrid: {
            apiKey: configVar("SendGrid API Key", "REQUIRED", String)(fromEnv("SENDGRID_API_KEY")),
        },
        stripe: {
            secretKey: configVar("Stripe Secret Key", "REQUIRED", String)(fromEnv("STRIPE_SECRET_KEY")),
            webhookSigningSecretKey: configVar("Stripe Secret Key", "REQUIRED", String)(fromEnv("STRIPE_WEBHOOK_SECRET_KEY")),
        },
        aes256: {
            initialisationVector: configVar("AES 256 Initialisation Vector", "REQUIRED", String)(fromEnv("AES_256_INITIALISATION_VECTOR")),
        },
        betterstack: {
            sourceToken: configVar("Better Stack Source Token", "REQUIRED", String)(fromEnv("BETTERSTACK_SOURCE_TOKEN")),
        },
        actionLink: {
            activeForMins: configVar("Action Link Expiry (in mins)", "REQUIRED", Int)(fromVal(60)),
        },
    },
});

export default {
    functions: functionsConfiguration,
    project: projectConfiguration,
};
