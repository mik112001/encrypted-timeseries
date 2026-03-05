import { Server } from "socket.io";
import { decryptUsingAes256CtrAglorithm, generateSecretKey } from "./helpers.mjs";
import { connectToMongoClient } from "./db/mongo.mjs";
import MinuteTimeSeriesData from "./models/timeSeriesModel.mjs";
import dotenv from "dotenv";

dotenv.config({ path: "../.env"});

// Creating a socket server which will receive message 
// Fist I will only connect emitter and listerner so that I can create a chhanel 
// or connection through which we will send and recive the message

const client = await connectToMongoClient();

const io = new Server(4000, {
    cors: {
        origin: "*"
    }
});

console.log("Listener is running on PORT 4000");

io.on("connection", async(socket) => {
    console.log("Emitter connected");
    socket.on("encrypted stream", async(encrypedStream) => {
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

            const now = new Date();

            payload.timeStamp = new Date();
            allDecrypedData.push(payload);

            const minuteBucket = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                now.getHours(),
                now.getMinutes()
            );

            await MinuteTimeSeriesData.updateOne(
                { minute: minuteBucket },
                { 
                    $push: { messages: payload },
                    $inc: { totalMessages: 1 }
                },
                { upsert: true }
            )
        }

        console.log("allDecrypedData: ", allDecrypedData);
    });
});