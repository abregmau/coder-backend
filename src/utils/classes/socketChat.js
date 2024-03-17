import { Server } from "socket.io";
import logger from "../loggers/errorLog.js";
import { messageModel } from "../../dao/schemas/messages.schema.js";

class socketChat {
    constructor(server, path) {
        this.io = new Server();
        this.io.attach(server, { path: path });
    }

    async start() {
        // let message = [];

        this.io.on("connection", async (socket) => {
            logger.info(`Client connected to Chat - Id: ${socket.id}`);

            socket.on("disconnect", () => {
                logger.info(`Disconnected client from Chat - Id: ${socket.id}`);
            });

            // User Name
            let userName = "";

            // Connection messages
            socket.on("userConnection", async (data) => {
                userName = data.user;
                let newMessage = {
                    id: socket.id,
                    info: "connection",
                    name: data.user,
                    message: `${data.user} Connected`,
                    date: new Date().toTimeString(),
                };
                // message.push(newMessage);
                await messageModel.create(newMessage);
                let message = await messageModel.find().lean();
                this.io.sockets.emit("userConnection", message);
            });

            // Messages
            socket.on("userMessage", async (data) => {
                let newMessage = {
                    id: socket.id,
                    info: "message",
                    name: userName,
                    message: data.message,
                    date: new Date().toTimeString(),
                };
                // message.push(newMessage);
                await messageModel.create(newMessage);
                let message = await messageModel.find().lean();
                this.io.sockets.emit("userMessage", message);
            });

            // Typing
            socket.on("typing", async (data) => {
                socket.broadcast.emit("typing", {
                    nameUser: data.nameUser,
                });
            });
        });
    }
}

export { socketChat };
