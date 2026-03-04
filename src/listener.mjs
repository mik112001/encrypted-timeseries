import { Server } from "socket.io";
import { decryptUsingAes256CtrAglorithm, generateSecretKey } from "./helpers.mjs";

// Creating a socket server which will receive message 
// Fist I will only connect emitter and listerner so that I can create a chhanel 
// or connection through which we will send and recive the message

const io = new Server(4000, {
    cors: {
        origin: "*"
    }
});

console.log("Listener is running on PORT 4000");

io.on("connection", (socket) => {
    console.log("Emitter connected");
    socket.on("encrypted stream", (encrypedStream) => {
        console.log("Received encryted message", encrypedStream);
        const encrypedStreamData = encrypedStream.split("|");
        const allDecrypedData = [];
        for(const encrypedData of encrypedStreamData) {
            const decryptedData = decryptUsingAes256CtrAglorithm(encrypedData);

            const payload = JSON.parse(decryptedData);
            console.log("payload: ", payload);

            // const payload = {
            //     name: decryptedData.name,
            //     origin: decryptedData.origin,
            //     destination: decryptedData.destination
            // }

            const expectedKey = generateSecretKey({
                name: payload.name,
                origin: payload.origin,
                destination: payload.destination
            });

            if(expectedKey !== payload.secret_key) {
                console.warn("Data Intgrity check failed for message", payload);
                continue;
            }

            payload.timeStamp = Date.now();
            allDecrypedData.push(payload);
        }
        console.log("allDecrypedData: ", allDecrypedData);
    });
});