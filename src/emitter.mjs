// Here I will create the message 
// Add secret key 
// encrypt it using aes-256-ctr algorithm and size should be in the range of 49-499 

// import { data } from "../data/data.json";
import { decryptUsingAes256CtrAglorithm, encryptUsingAes256CtrAglorithm, generateSecretKey } from "./helpers.mjs";

export const encryptStreamData = () => {
    try {
        // Get data first and validate it
        const originalData = {
            name: 'Jack Reacher',
            origin: 'Bengaluru',
            destination: 'Mumbai'
        };

        // Create sha-256 key
        const secretKey = generateSecretKey(originalData);
        console.log("secretKey: ", secretKey);
        const sumCheckMessage = {
            ...originalData,
            secret_key: secretKey
        }

        // Now encrypt it using aes-256-ctr algorithm
        const encryptedData = encryptUsingAes256CtrAglorithm(JSON.stringify(sumCheckMessage));
        console.log("encryptedData :", encryptedData);
        // Then use socket and send it to listener and also implement to read message stream in every 10 seconds

        const decryptedData = decryptUsingAes256CtrAglorithm(encryptedData);
        console.log("decryptedData: ", decryptedData);

    } catch(error) {
        console.error("Error for encryptData: ", error);
        throw error;
    }
};

encryptStreamData();
