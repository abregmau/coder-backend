import { productModel } from "../schemas/products.schema.js";
import { rtSocketServer } from "../../app.js";
import logger from "../../utils/loggers/errorLog.js";

export default class ProductDao {
    constructor() {}

    async getProducts(query = {}) {
        try {
            let { limit, page, sort, category, available } = query;
            limit = parseInt(limit);
            page = parseInt(page);

            let products = await productModel.find().lean();
            let productsLength = products.length;

            if (sort) {
                if (sort === "asc") {
                    products.sort((a, b) => a.price - b.price);
                } else if (sort === "desc") {
                    products.sort((a, b) => b.price - a.price);
                }
            }

            if (category) {
                products = products.filter((product) => product.category === category);
            }

            if (available) {
                products = products.filter((product) => product.status === available);
            }

            if (!limit) {
                limit = 10;
            }
            if (page) {
                const startIndex = (page - 1) * limit;
                const endIndex = page * limit;
                products = products.slice(startIndex, endIndex);
            } else {
                products = products.slice(0, limit);
            }

            let response = {
                status: "success",
                payload: products,
                totalPages: Math.ceil(productsLength / limit),
                prevPage: page > 1 ? page - 1 : null,
                nextPage: page < Math.ceil(productsLength / limit) ? page + 1 : null,
                page: page,
                hasPrevPage: page > 1,
                hasNextPage: page < Math.ceil(productsLength / limit),
                prevLink: page > 1 ? `/api/products?page=${page - 1}&limit=${limit}` : null,
                nextLink:
                    page < Math.ceil(productsLength / limit) ? `/api/products?page=${page + 1}&limit=${limit}` : null,
            };

            return response;
        } catch (error) {
            logger.error(`Error while processing request: ${error}`);
            return { status: "error", message: "Internal Server Error" };
        }
    }

    async getProductById(id) {
        //Regular expression to check if the string is hexadecimal
        const hexRegex = /^[0-9a-fA-F]+$/;

        try {
            if (!hexRegex.test(id)) {
                return { status: "badRequest", message: "The ID is not valid hexadecimal" };
            } else if (id.length !== 24) {
                return { status: "badRequest", message: "The length of the ID is not valid" };
            }

            const productFind = await productModel.findOne({ _id: id }).lean();

            if (productFind) {
                return { status: "success", payload: productFind };
            } else {
                return { status: "badRequest", message: "Product not found" };
            }
        } catch (error) {
            logger.error(`Error while processing request: ${error}`);
            return { status: "error", message: "Internal Server Error" };
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
                status: "badRequest",
                message: "Error: Check required fields.",
            };
        }

        if (!(typeof product.status === "boolean")) {
            product.status = true;
        }

        // Add product
        try {
            await productModel.create(product);
            rtSocketServer.io.sockets.emit("updateProducts", (await this.getProducts()).payload);
            return { status: "success", message: "Successfully added product" };
        } catch (error) {
            if (error.code === 11000 && error.keyPattern && error.keyPattern.code) {
                return { status: "badRequest", message: "Code already exists" };
            } else {
                logger.error(`Error while processing request: ${error}`);
                return { status: "error", message: "Error adding product: " + error.message };
            }
        }
    }

    async updateProduct(id, modifiedProduct) {
        try {
            const productFind = await productModel.findOne({ _id: id });
            if (productFind) {
                await productModel.updateOne({ _id: id }, modifiedProduct);
                rtSocketServer.io.sockets.emit("updateProducts", (await this.getProducts()).payload);
                return { status: "success", message: "Successfully updated product" };
            } else {
                return { status: "badRequest", message: "Product not found" };
            }
        } catch (error) {
            logger.error(`Error while processing request: ${error}`);
            return { status: "error", message: "Error updating product: " + error.message };
        }
    }

    async deleteProduct(id) {
        try {
            const product = await productModel.findOneAndDelete({ _id: id });
            if (product) {
                rtSocketServer.io.sockets.emit("updateProducts", (await this.getProducts()).payload);
                return { status: "success", message: "Successfully deleted product" };
            } else {
                return { status: "badRequest", message: "Product not found" };
            }
        } catch (error) {
            logger.error(`Error while processing request: ${error}`);
            return { status: "error", message: "Error deleting product: " + error.message };
        }
    }
}
