import { Router } from "express";
import { products } from "./product.routes.js";

const viewRouter = Router();

viewRouter.get("/chat", async (req, res) => {
    res.render("chatTest", {
        script: "chatTest.js",
        title: "Chat Test | Websockets",
    });
});

viewRouter.get("/", async (req, res) => {
    res.render("home", {
        script: "home.js",
        title: "Advanced Express | Handlebars",
        products: await products.getProducts(),
    });
});

viewRouter.get("/:id", async (req, res) => {
    res.render("product", {
        title: "Advanced Express | Handlebars",
        product: (await products.getProductById(req.params.id)).product,
    });
});

export { viewRouter };
