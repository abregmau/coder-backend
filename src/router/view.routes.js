import { Router } from "express";
import { products } from "./product.routes.js";

const viewRouter = Router();

viewRouter.get("/realtimeproducts", async (req, res) => {
    res.render("realTimeProducts", {
        script: "realTimeProducts.js",
        title: "Advanced Express | Socket",
    });
});

viewRouter.get("/chat", async (req, res) => {
    res.render("chat", {
        script: "chat.js",
        title: "Advanced Express | Web Chat",
    });
});

viewRouter.get("/products", async (req, res) => {
    const readProducts = await products.getProducts(req.query);

    if (readProducts.status === "success") {
        res.render("home", {
            script: "home.js",
            title: "Advanced Express | Handlebars",
            products: readProducts.payload,
        });
    } else {
        res.status(400).send(readProducts.message);
    }
});

viewRouter.get("/products/:pid", async (req, res) => {
    const product = await products.getProductById(req.params.pid);

    if (product.status === "success") {
        res.render("product", {
            script: "home.js",
            title: "Advanced Express | Handlebars",
            product: product.payload,
        });
    } else if (product.status === "badRequest") {
        res.status(400).send(product.message);
    } else {
        res.status(500).send(product.message);
    }
});

export { viewRouter };
