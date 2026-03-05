import { Server } from "socket.io";
import { decryptUsingAes256CtrAglorithm, generateSecretKey } from "./helpers.mjs";
import { connectToMongoClient } from "./db/mongo.mjs";
import MinuteTimeSeriesData from "./models/timeSeriesModel.mjs";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config({ path: "../.env"});

// Creating a socket server which will receive message 
// Fist I will only connect emitter and listerner so that I can create a chhanel 
// or connection through which we will send and recive the message

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendPath = path.join(__dirname, "../frontend");

console.log("Serving frontend from:", frontendPath);

app.use(express.static(frontendPath));

app.listen(5000, () => {
    console.log("Frontend running on http://localhost:5000");
});

const client = await connectToMongoClient();

const io = new Server(4000, {
    cors: {
        origin: "*"
    }
});

console.log("Listener is running on PORT 4000");

io.on("connection", async(socket) => {
    console.log("Emitter connected");
    let now = "";
    socket.on("encrypted stream", async(encrypedStream) => {
        // console.log("Received encryted message", encrypedStream);
        const encrypedStreamData = encrypedStream.split("|");
        const allDecrypedData = [];
        for(const encrypedData of encrypedStreamData) {
            const decryptedData = decryptUsingAes256CtrAglorithm(encrypedData);

            const payload = JSON.parse(decryptedData);
            const expectedKey = generateSecretKey({
                name: payload.name,
                origin: payload.origin,
                destination: payload.destination
            });

            if(expectedKey !== payload.secret_key) {
                console.warn("Data Intgrity check failed for message", payload);
                continue;
            }
            now = new Date();
            payload.timeStamp = now;
            allDecrypedData.push(payload);
        }

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
                $push: { messages: { $each: allDecrypedData } },
                $inc: { totalMessages: allDecrypedData.length }
            },
            { upsert: true }
        );

        const totalMessages = encrypedStreamData.length;
        const validMessages = allDecrypedData.length;
        const failedMessages = totalMessages - validMessages;

        const successRate = (validMessages / totalMessages) * 100;
        console.log(`Success Rate: ${successRate.toFixed(2)}%`);
        // console.log("allDecrypedData: ", allDecrypedData);

        io.emit("processed data", {
            records: allDecrypedData,
            totalMessages,
            validMessages,
            failedMessages,
            successRate
        });
    });
});