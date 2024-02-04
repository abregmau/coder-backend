import mongoose from "mongoose";

const cartsCollection = "carts";

const productSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
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
