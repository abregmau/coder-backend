import { Server } from "socket.io";
import { products } from "../../router/product.routes.js";
import logger from "../loggers/errorLog.js";

class socketRealTime {
    constructor(server, path) {
        this.io = new Server();
        this.io.attach(server, { path: path });
    }

    async start() {
        this.io.on("connection", async (socket) => {
            logger.info(`Client connected to Realtime Products - Id: ${socket.id}`);
            socket.emit("updateProducts", (await products.getProducts()).payload);

            socket.on("disconnect", () => {
                logger.info(`Disconnected client from Realtime Products - Id: ${socket.id}`);
            });

            socket.on("addProduct", async (product) => {
                await products.addProduct(product);
                // this.io.sockets.emit("updateProducts", await products.getProducts());
                logger.info(`Product added by client Id: ${socket.id}`);
            });

            socket.on("deleteProduct", async (productId) => {
                await products.deleteProduct(productId);
                // this.io.sockets.emit("updateProducts", await products.getProducts());
                logger.info(`Product deleted by client Id: ${socket.id}`);
            });
        });
    }
}

export { socketRealTime };
