import { cartModel } from "../models/carts.model.js";
import { products } from "../../router/product.routes.js";

export default class CartDao {
    constructor() {}

    async getCarts() {
        try {
            const carts = await cartModel.find().lean();
            return { status: "success", payload: carts };
        } catch (error) {
            return { status: "error", message: "Internal Server Error" };
        }
    }

    async getCartById(id) {
        try {
            const cart = await cartModel.findById(id).lean();
            if (cart) {
                return { status: "success", payload: cart };
            } else {
                return { status: "badRequest", message: "Cart not found" };
            }
        } catch (error) {
            return { status: "error", message: "Internal Server Error" };
        }
    }

    async addCart() {
        try {
            await cartModel.create({ products: [] });
            return { status: "success", message: "Successfully added cart" };
        } catch (error) {
            return { status: "error", message: "Internal Server Error" };
        }
    }

    async deleteCart(id) {
        try {
            const cart = await cartModel.findByIdAndDelete(id);
            if (cart) {
                return { status: "success", message: "Successfully deleted cart" };
            } else {
                return { status: "badRequest", message: "Cart not found" };
            }
        } catch (error) {
            return { status: "error", message: "Internal Server Error" };
        }
    }

    async addProductToCart(cid, pid) {
        try {
            const checkId = await products.getProductById(pid);
            if (checkId.status !== "success") {
                return { status: "badRequest", message: "Product not found in database" };
            }

            const cart = await cartModel.findById(cid);
            if (cart) {
                const existingProductIndex = cart.products.findIndex((product) => product.id === pid);

                if (existingProductIndex !== -1) {
                    cart.products[existingProductIndex].quantity += 1;
                    await cart.save();
                    return { status: "success", message: "Successfully increased quantity" };
                } else {
                    cart.products.push({ _id: pid, quantity: 1 });
                    await cart.save();
                    return { status: "success", message: "Successfully added product" };
                }
            } else {
                return { status: "badRequest", message: "Cart not found" };
            }
        } catch (error) {
            return { status: "error", message: "Internal Server Error" };
        }
    }

    async delProductFromCart(cid, pid) {
        try {
            const cart = await cartModel.findById(cid);

            if (cart) {
                const existingProductIndex = cart.products.findIndex((product) => product.id === pid);

                if (existingProductIndex !== -1) {
                    if (cart.products[existingProductIndex].quantity > 1) {
                        cart.products[existingProductIndex].quantity -= 1;
                        await cart.save();
                        return { status: "success", message: "Successfully decreased quantity" };
                    } else {
                        cart.products.splice(existingProductIndex, 1);
                        await cart.save();
                        return { status: "success", message: "Successfully deleted product" };
                    }
                } else {
                    return { status: "badRequest", message: "Product not found in cart" };
                }
            }
        } catch (error) {
            return { status: "error", message: "Internal Server Error" };
        }
    }
}
