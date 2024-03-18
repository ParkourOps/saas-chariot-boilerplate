import serviceFactory from "@/libraries/service-factory";
import configuration from "@/configuration";
import crypto from "crypto";
import ServiceFunctionError from "@/libraries/service-factory/service-function-error";

const initialisationVector = configuration.functions.services.aes256.initialisationVector;

const aes256 = serviceFactory.createService(
    "AES 256",
    "A service for 256-bit symmetric encryption.",
    ()=>crypto,
);

export const createSecretKey = aes256.createServiceFunction(async (service, correlationId)=>{
    try {
        const secretKey = crypto.randomBytes(32).toString("hex");
        return secretKey;
    } catch (e) {
        throw ServiceFunctionError.createFromException(
            service.name,
            service.description,
            correlationId,
            e,
            "internal",
            "Could not generate secret key for encryption"
        )
    }
});

export const encrypt = aes256.createServiceFunction(async (
    service,
    correlationId,
    secretKey: string,
    input: string
)=>{
    try {
        const cypher = crypto.createCipheriv("aes-256-ccm", secretKey, initialisationVector);
        let encrypted = cypher.update(input, "utf8", "hex");
        encrypted += cypher.final();
        return encrypted;
    } catch (e) {
        throw ServiceFunctionError.createFromException(
            service.name,
            service.description,
            correlationId,
            e,
            "internal",
            "Could not encrypt data"
        )
    }
});

export const decrypt = aes256.createServiceFunction(async (
    service,
    correlationId,
    secretKey: string,
    input: string
)=>{
    try {
        const decypher = crypto.createDecipheriv("aes-256-ccm", secretKey, initialisationVector);
        let decrypted = decypher.update(input, "hex", "utf8");
        decrypted += decypher.final("utf8");
        return decrypted;
    } catch (e) {
        throw ServiceFunctionError.createFromException(
            service.name,
            service.description,
            correlationId,
            e,
            "internal",
            "Could not decrypt data"
        )
    }
});
