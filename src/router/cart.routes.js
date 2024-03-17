import { Router } from "express";
import CartManager from "../dao/file-managers/cart.manager.js";
import CartDao from "../dao/db-managers/cart.dao.js";

const cartRouter = Router();

// Uncomment File System or MongoDB
// const carts = new CartManager();
const carts = new CartDao();

cartRouter.get("/", async (req, res) => {
    const readCarts = await carts.getCarts();
    if (readCarts.status === "success") {
        res.send(readCarts);
    } else if (readCarts.status === "badRequest") {
        res.status(400).send(readCarts);
    } else {
        res.status(500).send(readCarts);
    }
});

cartRouter.get("/:cid", async (req, res) => {
    const cart = await carts.getCartById(req.params.cid);
    if (cart.status === "success") {
        res.send(cart);
    } else if (cart.status === "badRequest") {
        res.status(400).send(cart);
    } else {
        res.status(500).send(cart);
    }
});

cartRouter.post("/", async (req, res) => {
    // const newCart = req.body;
    const addedCart = await carts.addCart();

    if (addedCart.status === "success") {
        res.send(addedCart);
    } else if (addedCart.status === "error") {
        res.status(500).send(addedCart);
    }
});

cartRouter.put("/:cid", async (req, res) => {
    const modifiedCart = await carts.updateCart(req.params.cid, req.body);
    if (modifiedCart.status === "success") {
        res.send(modifiedCart);
    } else if (modifiedCart.status === "badRequest") {
        res.status(400).send(modifiedCart);
    } else {
        res.status(500).send(modifiedCart);
    }
});

cartRouter.delete("/:cid", async (req, res) => {
    const deletedCart = await carts.deleteCart(req.params.cid);
    if (deletedCart.status === "success") {
        res.send(deletedCart);
    } else if (deletedCart.status === "badRequest") {
        res.status(400).send(deletedCart);
    } else {
        res.status(500).send(deletedCart);
    }
});

cartRouter.post("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    const addedProduct = await carts.addProductToCart(cid, pid);
    if (addedProduct.status === "success") {
        res.send(addedProduct);
    } else if (addedProduct.status === "badRequest") {
        res.status(400).send(addedProduct);
    } else {
        res.status(500).send(addedProduct);
    }
});

cartRouter.put("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    const modifiedProduct = await carts.updateProductInCart(cid, pid, req.body);
    if (modifiedProduct.status === "success") {
        res.send(modifiedProduct);
    } else if (modifiedProduct.status === "badRequest") {
        res.status(400).send(modifiedProduct);
    } else {
        res.status(500).send(modifiedProduct);
    }
});

cartRouter.delete("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    const deletedProduct = await carts.delProductFromCart(cid, pid);
    if (deletedProduct.status === "success") {
        res.send(deletedProduct);
    } else if (deletedProduct.status === "badRequest") {
        res.status(400).send(deletedProduct);
    } else {
        res.status(500).send(deletedProduct);
    }
});

export { carts, cartRouter };
