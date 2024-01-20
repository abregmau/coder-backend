import { Router } from "express";
import logger from "../utils/loggers/errorLog.js";
import CartManager from "../classes/CartManager.js";

const cartRouter = Router();
const carts = new CartManager();

cartRouter.get("/", async (req, res) => {
    try {
        const readCarts = await carts.getCarts();
        res.send(readCarts);
    } catch (error) {
        logger.error(`Error while processing request: ${error}`);
        res.status(500).send("Internal Server Error");
    }
});

cartRouter.get("/:cid", async (req, res) => {
    let cart = await carts.getCartById(req.params.cid);
    if (cart.status === true) {
        res.send(cart.cart.products);
    } else {
        res.status(400).send(cart.message);
    }
});

cartRouter.post("/", async (req, res) => {
    try {
        // const newCart = req.body;
        const addedCart = await carts.addCart();
        res.send(addedCart);
    } catch (error) {
        logger.error(`Error while processing request: ${error}`);
        res.status(500).send("Internal Server Error");
    }
});

cartRouter.post("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const addedProduct = await carts.addProductToCart(cid, pid);
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

cartRouter.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const deletedProduct = await carts.delProductFromCart(cid, pid);
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

export { carts, cartRouter };
