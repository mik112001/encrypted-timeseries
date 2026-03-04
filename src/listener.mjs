import { Server } from "socket.io";
import { decryptUsingAes256CtrAglorithm } from "./helpers.mjs";

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
    socket.on("encrypted data", (encrypedData) => {
        console.log("Received encryted message", encrypedData);

        const decryptedData = decryptUsingAes256CtrAglorithm(encrypedData);
        console.log("decryptedData: ", decryptedData);
        // const payload = JSON.parse(decryptedData);
        // console.log("Payload: ", payload);
    });
});

export const decryptStreamData = async() => {
    try {
        // get data from socket 


        // decrypt that data

        // Store it in mongo timeseries database
    } catch(error) {
        console.error("Error for decryptStreamData: ", error);
        throw error;
    }
};