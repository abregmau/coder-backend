import mongoose from "mongoose";

const productsCollection = "products";

const productSchema = new mongoose.Schema({
    title: String,
    price: Number,
    thumbnail: Array,
    description: String,
    code: { type: String, unique: true },
    stock: Number,
    category: String,
    status: Boolean,
});

export const productModel = mongoose.model(productsCollection, productSchema);
