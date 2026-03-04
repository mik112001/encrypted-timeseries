import crypto from "crypto";

const algorithm = "aes-256-ctr";
const sharedKey = crypto.createHash("sha256").update("encrypted-timeseries-secret").digest();
const iv = Buffer.from("1234567890123456")

export const generateSecretKey = (message) => {
    const data = `${message.name}:${message.origin}:${message.destination}`;
    return crypto.createHash("sha256").update(data).digest("hex");
};

export const encryptUsingAes256CtrAglorithm = (text) => {
    const cipher = crypto.createCipheriv(algorithm, sharedKey, iv);

    const encryptedData = Buffer.concat([
        cipher.update(text),
        cipher.final()
    ])
    return encryptedData.toString("hex");
};

export const decryptUsingAes256CtrAglorithm = (encryptedText) => {
    const decipher = crypto.createDecipheriv(algorithm, sharedKey, iv);
    console.log("decipher: ", decipher);

    const decryptedData = Buffer.concat([
        decipher.update(Buffer.from(encryptedText, "hex")),
        decipher.final()
    ])
    return decryptedData.toString();
};