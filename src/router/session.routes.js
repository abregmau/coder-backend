import { Router } from "express";
import UsersDao from "../dao/db-managers/users.dao.js";

const sessionRouter = Router();

sessionRouter.post("/register", async (req, res) => {
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let email = req.body.email;
    let age = parseInt(req.body.age);
    let password = req.body.password;

    if (!firstName || !lastName || !email || !age || !password) {
        res.redirect("/register?status=10");
        return;
    }
    let emailExists = await UsersDao.getUserByEmail(email);

    if (emailExists) {
        res.redirect("/register?status=11");
        return;
    } else {
        await UsersDao.createUser(firstName, lastName, age, email, password);
        res.redirect("/login?status=0");
    }
});

sessionRouter.post("/login", async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    if (!email || !password) {
        res.redirect("/login?status=10");
    }

    let user = await UsersDao.getUserByCreds(email, password);

    if (!user) {
        res.redirect("/login?status=12");
    } else {
        req.session.user = user._id;
        res.redirect("/profile?status=1");
    }
});

sessionRouter.get("/logout", async (req, res) => {
    req.session.destroy((err) => {
        res.redirect("/login");
    });
});

sessionRouter.get("/test", auth, async (req, res) => {
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
