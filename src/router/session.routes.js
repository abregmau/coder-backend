import { Router } from "express";
import cookieParser from "cookie-parser";
import session from "express-session";

const sessionRouter = Router();

// Cookies
sessionRouter.use(cookieParser());
// sessionRouter.use(cookieParser("secretBackend"));

// Session
sessionRouter.use(
    session({
        secret: "secretBackend",
        resave: true,
        saveUninitialized: false,
        cookie: {
            maxAge: 600000,
        },
    })
);

sessionRouter.get("/login", (req, res) => {
    if (req.session.user) {
        res.redirect("/panel");
    } else {
        res.render("login", {
            script: "login.js",
        });
    }
});

sessionRouter.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Código temporal
    if (username === "admin" && password === "admin") {
        req.session.user = "admin";
        req.session.isAdmin = true;
        res.redirect("/panel");
    } else if (username === "user" && password === "user") {
        req.session.user = "user";
        req.session.isAdmin = false;
        res.redirect("/panel");
    } else {
        res.send("Invalid username or password");
    }
});

sessionRouter.get("/panel", (req, res) => {
    if (req.session.user) {
        let user = req.session.user;
        let isAdmin = req.session.isAdmin;
        console.log(user, isAdmin);

        res.render("panel", {
            script: "panel.js",
            username: user,
        });
    } else {
        res.redirect("/login");
    }
});

sessionRouter.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/login");
});

sessionRouter.get("/test", auth, (req, res) => {
    res.send("OK");
});

// Middleware
function auth(req, res, next) {
    if (req.session?.user === "admin" && req.session?.isAdmin) {
        return next();
    }
    return res.status(401).send("Unauthorized");
}

export { sessionRouter, auth };
