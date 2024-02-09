import mongoose from "mongoose";

const messagesCollection = "messages";

const messageSchema = new mongoose.Schema({
    socket_id: String,
    info: String,
    name: String,
    message: String,
    date: String,
});

export const messageModel = mongoose.model(messagesCollection, messageSchema);
