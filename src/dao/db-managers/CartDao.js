import { cartModel } from "../models/carts.model.js";
import { products } from "../../router/product.routes.js";

export default class CartDao {
    constructor() {}

    async getCarts() {
        const carts = await cartModel.find().lean();
        return carts;
    }

    async getCartById(id) {
        const cart = await cartModel.findById(id).lean();
        if (cart) {
            return { status: true, cart };
        } else {
            return { status: false, message: "Cart not found" };
        }
    }

    async addCart() {
        await cartModel.create({ products: [] });
        return "Successfully added cart";
    }

    async deleteCart(id) {
        const cart = await cartModel.findByIdAndDelete(id);
        if (cart) {
            return { status: true, message: "Successfully deleted cart" };
        } else {
            return { status: false, message: "Cart not found" };
        }
    }

    async addProductToCart(cid, pid) {
        let checkId = await products.getProductById(pid);
        if (checkId.status === false) {
            return { status: false, message: "Product not found in database" };
        }

        const cart = await cartModel.findById(cid);

        if (cart) {
            const existingProductIndex = cart.products.findIndex((product) => product.id === pid);

            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].quantity += 1;
                await cart.save();
                return { status: true, message: "Successfully increased quantity" };
            } else {
                cart.products.push({ _id: pid, quantity: 1 });
                await cart.save();
                return { status: true, message: "Successfully added product" };
            }
        } else {
            return { status: false, message: "Cart not found" };
        }
    }

    async delProductFromCart(cid, pid) {
        const cart = await cartModel.findById(cid);

        if (cart) {
            const existingProductIndex = cart.products.findIndex((product) => product.id === pid);

            if (existingProductIndex !== -1) {
                if (cart.products[existingProductIndex].quantity > 1) {
                    cart.products[existingProductIndex].quantity -= 1;
                    await cart.save();
                    return { status: true, message: "Successfully decreased quantity" };
                } else {
                    cart.products.splice(existingProductIndex, 1);
                    await cart.save();
                    return { status: true, message: "Successfully deleted product" };
                }
            } else {
                return { status: false, message: "Product not found in cart" };
            }
        }
    }
}
