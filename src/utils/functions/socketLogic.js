import { Server } from "socket.io";
import { products } from "../../router/product.routes.js";
import logger from "../../utils/loggers/errorLog.js";

class socketClass {
    constructor(server) {
        this.io = new Server(server);
    }

    async start() {
        this.io.on("connection", async (socket) => {
            logger.info(`Connected client Id: ${socket.id}`);
            socket.emit("updateProducts", await products.getProducts());

            socket.on("disconnect", () => {
                logger.info(`Disconnected client Id: ${socket.id}`);
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

export { socketClass };
