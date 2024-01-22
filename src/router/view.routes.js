import { Router } from "express";
import { products } from "./product.routes.js";

const viewRouter = Router();

viewRouter.get("/realtimeproducts", async (req, res) => {
    res.render("realTimeProducts", {
        script: "realTimeProducts.js",
        title: "Advanced Express | Socket",
    });
});

viewRouter.get("/", async (req, res) => {
    res.render("home", {
        script: "home.js",
        title: "Advanced Express | Handlebars",
        products: await products.getProducts(),
    });
});

viewRouter.get("/:pid", async (req, res) => {
    res.render("product", {
        script: "home.js",
        title: "Advanced Express | Handlebars",
        product: (await products.getProductById(req.params.pid)).product,
    });
});

export { viewRouter };
