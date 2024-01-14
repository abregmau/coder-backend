import express from "express";
import morganScript from "./src/utils/loggers/accessLog.js";
import logger from "./src/utils/loggers/errorLog.js";

import { productRouter } from "./src/router/product.routes.js";
import { cartRouter } from "./src/router/cart.routes.js";

const app = express();

// Configure morgan to use the write stream for logging
app.use(morganScript);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);

const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
    logger.info(`Server Listening in port: ${server.address().port}`);
});
server.on("error", (error) => logger.error(`Server error: ${error}`));
