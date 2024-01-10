import express from "express";
import ProductManager from "./src/controllers/ProductManager.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const products = new ProductManager();

app.get("/products", async (req, res) => {
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

app.get("/products/:pid", async (req, res) => {
    let product = await products.getProductById(req.params.pid);
    if (!product) {
        res.send({ error: "Product not found" });
    } else {
        res.send(product);
    }
});

app.post("/products", async (req, res) => {
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

app.delete("/products/:pid", async (req, res) => {
    try {
        const deletedProduct = await products.deleteProduct(req.params.pid);
        res.send(deletedProduct);
    } catch (error) {
        console.error(`Error while processing request: ${error}`);
        res.status(500).send("Internal Server Error");
    }
});

app.put("/products/:pid", async (req, res) => {
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

const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
    console.log(`Server Listening in port: ${server.address().port}`);
});
server.on("error", (error) => console.log(`Server error: ${error}`));
