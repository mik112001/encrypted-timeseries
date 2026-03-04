import crypto from "crypto";

const algorithm = "aes-256-ctr";
const sharedKey = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

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