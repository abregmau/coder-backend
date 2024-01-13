import { Router } from "express";
import ProductManager from "../controllers/ProductManager.js";

const productRouter = Router();
const products = new ProductManager();

productRouter.get("/", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit);
        const readProducts = await products.getProducts();

        if (!limit) {
            res.send(readProducts);
        } else {
            let productsLimit = readProducts.slice(0, limit);
            res.send(productsLimit);
        }
    } catch (error) {
        console.error(`Error while processing request: ${error}`);
        res.status(500).send("Internal Server Error");
    }
});

productRouter.get("/:pid", async (req, res) => {
    let product = await products.getProductById(req.params.pid);
    if (!product) {
        res.send({ error: "Product not found" });
    } else {
        res.send(product);
    }
});

productRouter.post("/", async (req, res) => {
    try {
        const newProduct = req.body;
        const addedProduct = await products.addProduct(
            newProduct.title,
            newProduct.description,
            newProduct.price,
            newProduct.thumbnail,
            newProduct.code,
            newProduct.stock
        );
        res.send(addedProduct);
    } catch (error) {
        console.error(`Error while processing request: ${error}`);
        res.status(500).send("Internal Server Error");
    }
});

productRouter.delete("/:pid", async (req, res) => {
    try {
        const deletedProduct = await products.deleteProduct(req.params.pid);
        res.send(deletedProduct);
    } catch (error) {
        console.error(`Error while processing request: ${error}`);
        res.status(500).send("Internal Server Error");
    }
});

productRouter.put("/:pid", async (req, res) => {
    try {
        const modifiedProduct = await products.updateProduct(
            req.params.pid,
            req.body
        );
        res.send(modifiedProduct);
    } catch (error) {
        console.error(`Error while processing request: ${error}`);
        res.status(500).send("Internal Server Error");
    }
});

export default productRouter;
