import express from "express";
import { engine } from "express-handlebars";
import __dirname from "./util.js";
import * as path from "path";

import morganScript from "./utils/loggers/accessLog.js";
import logger from "./utils/loggers/errorLog.js";

import { productRouter } from "./router/product.routes.js";
import { cartRouter } from "./router/cart.routes.js";
import { viewRouter } from "./router/view.routes.js";

const app = express();

// Configure morgan to use the write stream for logging
app.use(morganScript);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Statics Files
app.use("/", express.static(__dirname + "/public"));
app.use("/logs", express.static(__dirname + "/logs"));

// Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname + "/views"));

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewRouter);

const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
    logger.info(`Server Listening in port: ${server.address().port}`);
});
server.on("error", (error) => logger.error(`Server error: ${error}`));
