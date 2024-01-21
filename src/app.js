import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./utils/functions/utils.js";
import * as path from "path";
import { Server } from "socket.io";

import morganScript from "./utils/loggers/accessLog.js";
import logger from "./utils/loggers/errorLog.js";

import { productRouter } from "./router/product.routes.js";
import { cartRouter } from "./router/cart.routes.js";
import { viewRouter } from "./router/view.routes.js";

const app = express();

// Configure morgan to use the write stream for logging
app.use(morganScript);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Statics Files
app.use("/", express.static(__dirname + "/public"));
app.use("/logs", express.static(__dirname + "/logs"));

// Handlebars
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname + "/views"));

// Routes
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewRouter);

// Server
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
    logger.info(`Server Listening in port: ${server.address().port}`);
});
server.on("error", (error) => logger.error(`Server error: ${error}`));
const io = new Server(server);

io.on("connection", (socket) => {
    console.log(`Connected client. Id: ${socket.id}`);
    socket.on("disconnect", () => {
        console.log("Disconnected client.");
    });
    socket.on("userConnection", (data) => {
        console.log(data);
    });
});
