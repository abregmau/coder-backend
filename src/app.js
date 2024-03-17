import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./utils/functions/patch.js";
import * as path from "path";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";

import morganScript from "./utils/loggers/accessLog.js";
import logger from "./utils/loggers/errorLog.js";

import { productRouter } from "./router/product.routes.js";
import { cartRouter } from "./router/cart.routes.js";
import { viewRouter } from "./router/view.routes.js";
import { sessionRouter } from "./router/session.routes.js";
import { socketRealTime } from "./utils/classes/socketRealTime.js";
import { socketChat } from "./utils/classes/socketChat.js";
import { MONGODB_URI, PORT } from "./utils/functions/config.js";

const app = express();

// Database
mongoose.connect(MONGODB_URI);

// HTTP Server
const httpServer = app.listen(PORT, () => {
    logger.info(`Server Listening in port: ${httpServer.address().port}`);
});
httpServer.on("error", (error) => logger.error(`Server error: ${error}`));

// RealTime Products WebSockets Server
const rtSocketServer = new socketRealTime(httpServer, "/realtimeproducts");
rtSocketServer.start();

// Chat WebSockets Server
const chatServer = new socketChat(httpServer, "/chat");
chatServer.start();

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

// Cookies
app.use(cookieParser());
// sessionRouter.use(cookieParser("secretBackend"));

// Session
app.use(
    session({
        secret: "secretBackend",
        resave: true,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: MONGODB_URI,
            // mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
            ttl: 10000, // ttl: 15,
        }),
        cookie: {
            maxAge: 600000,
        },
    })
);

// Routes
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/session", sessionRouter);
app.use("/", viewRouter);
app.use("/", sessionRouter);

export { httpServer, rtSocketServer };
