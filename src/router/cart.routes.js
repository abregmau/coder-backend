import { Router } from "express";
import CartManager from "../controllers/CartManager.js";

const cartRouter = Router();
const carts = new CartManager();

cartRouter.get("/", async (req, res) => {
    try {
        const readCarts = await carts.getCarts();
        res.send(readCarts);
    } catch (error) {
        console.error(`Error while processing request: ${error}`);
        res.status(500).send("Internal Server Error");
    }
});

cartRouter.get("/:cid", async (req, res) => {
    let cart = await carts.getCartById(req.params.cid);
    if (!cart) {
        res.send({ error: "Cart not found" });
    } else {
        res.send(cart.products);
    }
});

cartRouter.post("/", async (req, res) => {
    try {
        // const newCart = req.body;
        const addedCart = await carts.addCart();
        res.send(addedCart);
    } catch (error) {
        console.error(`Error while processing request: ${error}`);
        res.status(500).send("Internal Server Error");
    }
});

cartRouter.post("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const addedProduct = await carts.addProductToCart(cid, pid);
        res.send(addedProduct);
    } catch (error) {
        console.error(`Error while processing request: ${error}`);
        res.status(500).send("Internal Server Error");
    }
});

cartRouter.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const deletedProduct = await carts.delProductFromCart(cid, pid);
        res.send(deletedProduct);
    } catch (error) {
        console.error(`Error while processing request: ${error}`);
        res.status(500).send("Internal Server Error");
    }
});

export { carts, cartRouter };
