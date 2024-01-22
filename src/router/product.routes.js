import { Router } from "express";
import logger from "../utils/loggers/errorLog.js";
import ProductManager from "../classes/ProductManager.js";

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
        logger.error(`Error while processing request: ${error}`);
        res.status(500).send("Internal Server Error");
    }
});

productRouter.get("/:pid", async (req, res) => {
    let product = await products.getProductById(req.params.pid);
    if (product.status === true) {
        res.send(product.product);
    } else {
        res.status(400).send(product.message);
    }
});

productRouter.post("/", async (req, res) => {
    try {
        const newProduct = req.body;
        const addedProduct = await products.addProduct(newProduct);
        if (addedProduct.status === true) {
            res.send(addedProduct.message);
        } else {
            res.status(400).send(addedProduct.message);
        }
    } catch (error) {
        logger.error(`Error while processing request: ${error}`);
        res.status(500).send("Internal Server Error");
    }
});

productRouter.delete("/:pid", async (req, res) => {
    try {
        const deletedProduct = await products.deleteProduct(req.params.pid);
        if (deletedProduct.status === true) {
            res.send(deletedProduct.message);
        } else {
            res.status(400).send(deletedProduct.message);
        }
    } catch (error) {
        logger.error(`Error while processing request: ${error}`);
        res.status(500).send("Internal Server Error");
    }
});

productRouter.put("/:pid", async (req, res) => {
    try {
        const modifiedProduct = await products.updateProduct(
            req.params.pid,
            req.body
        );
        if (modifiedProduct.status === true) {
            res.send(modifiedProduct.message);
        } else {
            res.status(400).send(modifiedProduct.message);
        }
    } catch (error) {
        logger.error(`Error while processing request: ${error}`);
        res.status(500).send("Internal Server Error");
    }
});

export { products, productRouter };
