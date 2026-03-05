import mongoose from "mongoose";

const messageModel = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        origin: {
            type: String,
            required: true
        },
        destination: {
            type: String,
            required: true
        },
        timeStamp: {
            type: Date,
            required: true
        }
    }, 
    { _id: false }
);

const minuteTimeSeriesDataSchema = new mongoose.Schema(
    {
        minute: {
            type: Date,
            required: true,
            index: true
        },
        messages: [messageModel],
        totalMessages: {
            type: Number,
            default: 0
        }
    }, 
    { versionKey: false }
);

export default mongoose.model("MinuteTimeSeriesData", minuteTimeSeriesDataSchema, "timeSeriesData");