import { Router } from "express";
import { products } from "./product.routes.js";
import { carts } from "./cart.routes.js";
import UsersDao from "../dao/db-managers/users.dao.js";

const viewRouter = Router();

// Session Views

viewRouter.get("/", async (req, res) => {
    res.redirect("/home");
});

viewRouter.get("/home", async (req, res) => {
    if (req.session.user) {
        res.redirect("/profile");
    } else {
        res.render("home", {
            script: "home.js",
            title: "Home | Ecommerce",
        });
    }
});

viewRouter.get("/register", async (req, res) => {
    res.render("register", {
        script: "sessions.js",
        title: "Register | Ecommerce",
    });
});

viewRouter.get("/login", async (req, res) => {
    if (req.session.user) {
        res.redirect("/profile");
    } else {
        res.render("login", {
            script: "sessions.js",
            title: "Login | Ecommerce",
        });
    }
});

viewRouter.get("/profile", async (req, res) => {
    if (req.session.user) {
        const user = await UsersDao.getUserByID(req.session.user);
        res.render("profile", {
            script: "sessions.js",
            title: "Profile | Ecommerce",
            user: user,
        });
    } else {
        res.redirect("/login");
    }
});

// Other Views

viewRouter.get("/realtimeproducts", async (req, res) => {
    res.render("realTimeProducts", {
        script: "realTimeProducts.js",
        title: "Live Products | Ecommerce",
    });
});

viewRouter.get("/chat", async (req, res) => {
    res.render("chat", {
        script: "chat.js",
        title: "Web Chat | Ecommerce",
    });
});

viewRouter.get("/products", async (req, res) => {
    const readProducts = await products.getProducts(req.query);

    if (readProducts.status === "success") {
        res.render("products", {
            script: "products.js",
            title: "List of Products | Ecommerce",
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
