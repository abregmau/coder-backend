import { promises as fs } from "fs";
import { nanoid } from "nanoid";

export default class CartManager {
    constructor() {
        this.patch = "./src/models/carts.json";
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
        await this.checkLoadedFile();
        return this.carts;
    };

    getCartById = async (id) => {
        await this.checkLoadedFile();
        const cartId = this.carts.find((cart) => cart.id === id);
        if (cartId) {
            return cartId;
        } else {
            return "Cart not found";
        }
    };

    addCart = async () => {
        await this.checkLoadedFile();
        let newCartWithId = { id: nanoid(8), products: [] };
        this.carts.push(newCartWithId);
        await this.writeCartsToFile();
        return "Successfully added cart";
    };

    addProductToCart = async (cid, pid) => {
        await this.checkLoadedFile();
        const cartIndex = this.carts.findIndex((cart) => cart.id === cid);
        if (cartIndex === -1) {
            return "Cart not found";
        } else {
            const productIndex = this.carts[cartIndex].products.findIndex(
                (product) => product.id === pid
            );
            if (productIndex === -1) {
                this.carts[cartIndex].products.push({ id: pid, quantity: 1 });
                await this.writeCartsToFile();
                return "Successfully added product";
            } else {
                this.carts[cartIndex].products[productIndex].quantity++;
                return "Successfully increased quantity";
            }
        }
    };

    delProductFromCart = async (cid, pid) => {
        await this.checkLoadedFile();
        const cartIndex = this.carts.findIndex((cart) => cart.id === cid);
        if (cartIndex === -1) {
            return "Cart not found";
        } else {
            const productIndex = this.carts[cartIndex].products.findIndex(
                (product) => product.id === pid
            );
            if (productIndex === -1) {
                return "Product not found";
            } else {
                this.carts[cartIndex].products.splice(productIndex, 1);
                await this.writeCartsToFile();
                return "Successfully deleted product";
            }
        }
    };
}
