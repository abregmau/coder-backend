import { Router } from "express";
import { products } from "./product.routes.js";
import { carts } from "./cart.routes.js";

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
        res.render("products", {
            script: "products.js",
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
            script: "product.js",
            title: "Advanced Express | Handlebars",
            product: product.payload,
        });
    } else if (product.status === "badRequest") {
        res.status(400).send(product.message);
    } else {
        res.status(500).send(product.message);
    }
});

viewRouter.get("/carts/:cid", async (req, res) => {
    const cart = await carts.getCartById(req.params.cid);

    if (cart.status === "success") {
        res.render("cart", {
            script: "cart.js",
            title: "Advanced Express | Handlebars",
            cart: cart.payload,
        });
    } else if (cart.status === "badRequest") {
        res.status(400).send(cart.message);
    } else {
        res.status(500).send(cart.message);
    }
});

export { viewRouter };
