import { promises as fs } from "fs";
import { nanoid } from "nanoid";
import { products } from "../../router/product.routes.js";

export default class CartManager {
    constructor() {
        this.patch = "./src/dao/models/carts.json";
        this.carts = null;
    }

    readCartsFromFile = async () => {
        try {
            const carts = await fs.readFile(this.patch, "utf-8");
            this.carts = JSON.parse(carts);
            return "Successfully read carts";
        } catch (error) {
            if (error.code === "ENOENT") {
                this.carts = [];
                await this.writeCartsToFile();
                return "File did not exist, created an empty one";
            } else {
                return error;
            }
        }
    };

    writeCartsToFile = async () => {
        try {
            await fs.writeFile(this.patch, JSON.stringify(this.carts));
            return "Successfully wrote carts";
        } catch (error) {
            return error;
        }
    };

    checkLoadedFile = async () => {
        if (!this.carts) {
            await this.readCartsFromFile();
        }
    };

    getCarts = async () => {
        try {
            await this.checkLoadedFile();
            return { status: "success", payload: this.carts };
        } catch (error) {
            return { status: "error", message: "Internal Server Error" };
        }
    };

    getCartById = async (id) => {
        try {
            await this.checkLoadedFile();
            const cartId = this.carts.find((cart) => cart.id === id);
            if (cartId) {
                return { status: "success", payload: cartId };
            } else {
                return { status: "badRequest", message: "Cart not found" };
            }
        } catch (error) {
            return { status: "error", message: "Internal Server Error" };
        }
    };

    addCart = async () => {
        try {
            await this.checkLoadedFile();
            let newCartWithId = { id: nanoid(8), products: [] };
            this.carts.push(newCartWithId);
            await this.writeCartsToFile();
            return { status: "success", message: "Successfully added cart" };
        } catch (error) {
            return { status: "error", message: "Internal Server Error" };
        }
    };

    deleteCart = async (id) => {
        try {
            await this.checkLoadedFile();
            const cartIndex = this.carts.findIndex((cart) => cart.id === id);
            if (cartIndex === -1) {
                return { status: "badRequest", message: "Cart not found" };
            } else {
                this.carts.splice(cartIndex, 1);
                await this.writeCartsToFile();
                return { status: "success", message: "Successfully deleted cart" };
            }
        } catch (error) {
            return { status: "error", message: "Internal Server Error" };
        }
    };

    addProductToCart = async (cid, pid) => {
        try {
            await this.checkLoadedFile();

            let checkId = await products.getProductById(pid);
            if (checkId.status === "badRequest") {
                return { status: "badRequest", message: "Product not found in database" };
            }

            const cartIndex = this.carts.findIndex((cart) => cart.id === cid);
            if (cartIndex === -1) {
                return { status: "badRequest", message: "Cart not found" };
            } else {
                const productIndex = this.carts[cartIndex].products.findIndex((product) => product.id === pid);
                if (productIndex === -1) {
                    this.carts[cartIndex].products.push({ id: pid, quantity: 1 });
                    await this.writeCartsToFile();
                    return { status: "success", message: "Successfully added product" };
                } else {
                    this.carts[cartIndex].products[productIndex].quantity++;
                    await this.writeCartsToFile();
                    return {
                        status: "success",
                        message: "Successfully increased quantity",
                    };
                }
            }
        } catch (error) {
            return { status: "error", message: "Internal Server Error" };
        }
    };

    delProductFromCart = async (cid, pid) => {
        try {
            await this.checkLoadedFile();
            const cartIndex = this.carts.findIndex((cart) => cart.id === cid);
            if (cartIndex === -1) {
                return { status: "badRequest", message: "Cart not found" };
            } else {
                const productIndex = this.carts[cartIndex].products.findIndex((product) => product.id === pid);
                if (productIndex === -1) {
                    return { status: "badRequest", message: "Product not found" };
                } else {
                    if (this.carts[cartIndex].products[productIndex].quantity > 1) {
                        this.carts[cartIndex].products[productIndex].quantity--;
                        await this.writeCartsToFile();
                        return {
                            status: "success",
                            message: "Successfully decreased quantity",
                        };
                    } else {
                        this.carts[cartIndex].products.splice(productIndex, 1);
                        await this.writeCartsToFile();
                        return {
                            status: "success",
                            message: "Successfully deleted product",
                        };
                    }
                }
            }
        } catch (error) {
            return { status: "error", message: "Internal Server Error" };
        }
    };

    updateProductInCart = async (cid, pid, body) => {
        try {
            await this.checkLoadedFile();
            const cartIndex = this.carts.findIndex((cart) => cart.id === cid);
            if (cartIndex === -1) {
                return { status: "badRequest", message: "Cart not found" };
            } else {
                const productIndex = this.carts[cartIndex].products.findIndex((product) => product.id === pid);
                if (productIndex === -1) {
                    return { status: "badRequest", message: "Product not found" };
                } else {
                    this.carts[cartIndex].products[productIndex].quantity = body.quantity;
                    await this.writeCartsToFile();
                    return {
                        status: "success",
                        message: "Successfully updated quantity",
                    };
                }
            }
        } catch (error) {
            return { status: "error", message: "Internal Server Error" };
        }
    };
}
