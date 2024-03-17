import { Router, query } from "express";
import ProductManager from "../dao/file-managers/product.manager.js";
import ProductDao from "../dao/db-managers/product.dao.js";

const productRouter = Router();

// Uncomment File System or MongoDB
// const products = new ProductManager();
const products = new ProductDao();

productRouter.get("/", async (req, res) => {
    const readProducts = await products.getProducts(req.query);

    if (readProducts.status === "success") {
        res.send(readProducts);
    } else {
        res.status(400).send(readProducts);
    }
});

productRouter.get("/:pid", async (req, res) => {
    const product = await products.getProductById(req.params.pid);

    if (product.status === "success") {
        res.send(product);
    } else if (product.status === "badRequest") {
        res.status(400).send(product);
    } else {
        res.status(500).send(product);
    }
});

productRouter.post("/", async (req, res) => {
    const newProduct = req.body;
    const addedProduct = await products.addProduct(newProduct);
    if (addedProduct.status === "success") {
        res.send(addedProduct);
    } else if (addedProduct.status === "badRequest") {
        res.status(400).send(addedProduct);
    } else {
        res.status(500).send(addedProduct);
    }
});

productRouter.delete("/:pid", async (req, res) => {
    const deletedProduct = await products.deleteProduct(req.params.pid);
    if (deletedProduct.status === "success") {
        res.send(deletedProduct);
    } else if (deletedProduct.status === "badRequest") {
        res.status(400).send(deletedProduct);
    } else {
        res.status(500).send(deletedProduct);
    }
});

productRouter.put("/:pid", async (req, res) => {
    const modifiedProduct = await products.updateProduct(req.params.pid, req.body);
    if (modifiedProduct.status === "success") {
        res.send(modifiedProduct);
    } else if (modifiedProduct.status === "badRequest") {
        res.status(400).send(modifiedProduct);
    } else {
        res.status(500).send(modifiedProduct);
    }
});

export { products, productRouter };
