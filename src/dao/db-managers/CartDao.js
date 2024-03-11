import { cartModel } from "../models/carts.model.js";
import { products } from "../../router/product.routes.js";

export default class CartDao {
    constructor() {}

    async getCarts() {
        try {
            const carts = await cartModel.find().populate("products._id").lean();
            return { status: "success", payload: carts };
        } catch (error) {
            return { status: "error", message: "Internal Server Error" };
        }
    }

    async getCartById(id) {
        try {
            const cart = await cartModel.findById(id).populate("products._id").lean();
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

    async updateCart(id, cart) {
        // Validations are missing!!!
        try {
            const updatedCart = await cartModel.findByIdAndUpdate(id, cart, {
                new: true,
            });
            if (updatedCart) {
                return { status: "success", payload: updatedCart };
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
            const cart = await cartModel.findByIdAndUpdate(
                cid,
                {
                    $pull: {
                        products: { _id: pid },
                    },
                },
                { new: true }
            );

            if (cart) {
                return { status: "success", message: "Successfully deleted product" };
            } else {
                return { status: "badRequest", message: "Product not found in cart" };
            }
        } catch (error) {
            return { status: "error", message: "Internal Server Error" };
        }
    }

    async updateProductInCart(cid, pid, body) {
        try {
            const cart = await cartModel.findByIdAndUpdate(
                cid,
                { $set: { "products.$[elem].quantity": body.quantity } },
                { arrayFilters: [{ "elem._id": pid }], new: true }
            );
            if (cart) {
                return { status: "success", message: "Successfully updated quantity" };
            } else {
                return { status: "badRequest", message: "Cart not found" };
            }
        } catch (error) {
            console.log(error);
            return { status: "error", message: "Internal Server Error" };
        }
    }
}
