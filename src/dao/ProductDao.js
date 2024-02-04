import { productModel } from "../models/products.model.js";
import { socketServer } from "../app.js";

export default class ProductDao {
    constructor() {}

    async getProducts() {
        const products = await productModel.find().lean();
        return products;
    }

    async getProductById(id) {
        //Regular expression to check if the string is hexadecimal
        const hexRegex = /^[0-9a-fA-F]+$/;

        if (!hexRegex.test(id)) {
            return { status: false, message: "The ID is not valid hexadecimal" };
        } else if (id.length !== 24) {
            return { status: false, message: "The length of the ID is not valid" };
        }
        const productFind = await productModel.findOne({ _id: id }).lean();

        if (productFind) {
            return { status: true, product: productFind };
        } else {
            return { status: false, message: "Product not found" };
        }
    }

    async addProduct(product) {
        // Validations
        if (
            !product.title ||
            !product.description ||
            !product.code ||
            isNaN(product.price) ||
            isNaN(product.stock) ||
            !product.category
        ) {
            return {
                status: false,
                message: "Error: Check required fields.",
            };
        }

        if (!(typeof product.status === "boolean")) {
            product.status = true;
        }

        // Add product
        try {
            await productModel.create(product);
            socketServer.io.sockets.emit("updateProducts", await this.getProducts());
            return { status: true, message: "Successfully added product" };
        } catch (error) {
            if (error.code === 11000 && error.keyPattern && error.keyPattern.code) {
                return { status: false, message: "Code already exists" };
            } else {
                return { status: false, message: "Error adding product: " + error.message };
            }
        }
    }

    async updateProduct(id, modifiedProduct) {
        const productFind = await productModel.findOne({ _id: id });
        if (productFind) {
            try {
                await productModel.updateOne({ _id: id }, modifiedProduct);
                socketServer.io.sockets.emit("updateProducts", await this.getProducts());
                return { status: true, message: "Successfully updated product" };
            } catch (error) {
                return { status: false, message: "Error updating product: " + error.message };
            }
        } else {
            return { status: false, message: "Product not found" };
        }
    }

    async deleteProduct(id) {
        const product = await productModel.findOneAndDelete({ _id: id });
        if (product) {
            socketServer.io.sockets.emit("updateProducts", await this.getProducts());
            return { status: true, message: "Successfully deleted product" };
        } else {
            return { status: false, message: "Product not found" };
        }
    }
}
