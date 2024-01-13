import express from "express";
import { productRouter } from "./src/router/product.routes.js";
import { cartRouter } from "./src/router/cart.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);

const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
    console.log(`Server Listening in port: ${server.address().port}`);
});
server.on("error", (error) => console.log(`Server error: ${error}`));
