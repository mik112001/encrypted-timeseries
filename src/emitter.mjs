import data from "../data/data.json" assert { type: "json" };
import { encryptUsingAes256CtrAglorithm, generateSecretKey } from "./helpers.mjs";
import { io } from "socket.io-client";
import dotenv from "dotenv";

dotenv.config({ path: "../.env"});

const socket = io(process.env.SOCKET_URI);

export const encryptStreamData = () => {
    try {
        // Get data first and validate it
        // Here first I have run it for single message
        // Then use array of message or data
        // Now final as per requirement need random 49-499 messages or data from the data.json file
        // For this I have added sample data in data.json file
        // And then randomly create a number between 49 and 499
        // And pick that many data from the data.json file (you can also add your data.json file for testing purpose)

        const messageCount = Math.floor(Math.random() * (499 - 49 + 1)) + 49;

        let allEncrypedData = [];
        for(let i = 0; i < messageCount; i++) {
            const originalData = getRandomMessageFromDataFile(data.originalMessage.length);
            if(!originalData?.destination || !originalData?.name || !originalData.origin) {
                continue;
            }

            // Create sha-256 key
            const secretKey = generateSecretKey(originalData);
            console.log("secretKey: ", secretKey);
            const sumCheckMessage = {
                ...originalData,
                secret_key: secretKey
            }

            // Now encrypt it using aes-256-ctr algorithm
            const encryptedData = encryptUsingAes256CtrAglorithm(JSON.stringify(sumCheckMessage));
            allEncrypedData.push(encryptedData);
        }
        const encryptStream = allEncrypedData.join("|");
       console.log(`Generated encrypted stream with ${allEncrypedData.length} messages`);
        return encryptStream;

    } catch(error) {
        console.error("Error for encryptData: ", error);
        throw error;
    }
};

socket.on("connect", () => {
    console.log("Connected to listener");
    setInterval(() => {
        const encrypedStream = encryptStreamData();
        socket.emit("encrypted stream", encrypedStream);
        console.log("Message sent successfully");
    }, 10000);
});

const getRandomMessageFromDataFile = (originalMessageLength) => {
    const originalMessage = data.originalMessage;
    return originalMessage[Math.floor(Math.random() * originalMessageLength)];
}; 