import mongoose from "mongoose";

const cartsCollection = "carts";

const productSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
    },
    quantity: {
        type: Number,
        default: 1,
    },
});

const cartSchema = new mongoose.Schema({
    products: [productSchema],
});

export const cartModel = mongoose.model(cartsCollection, cartSchema);
