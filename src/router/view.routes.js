import { Router } from "express";
import { products } from "./product.routes.js";

const viewRouter = Router();

viewRouter.get("/", async (req, res) => {
    res.render("home", {
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
