import { promises as fs } from "fs";
import { nanoid } from "nanoid";
import { rtSocketServer } from "../../app.js";

export default class ProductManager {
    constructor() {
        this.patch = "./src/dao/models/products.json";
        this.products = null;
    }

    readProductsFromFile = async () => {
        try {
            const products = await fs.readFile(this.patch, "utf-8");
            this.products = JSON.parse(products);
            return "Successfully read products";
        } catch (error) {
            if (error.code === "ENOENT") {
                this.products = [];
                await this.writeProductsToFile();
                return "File did not exist, created an empty one";
            } else {
                return error;
            }
        }
    };

    writeProductsToFile = async () => {
        try {
            await fs.writeFile(this.patch, JSON.stringify(this.products));
            rtSocketServer.io.sockets.emit("updateProducts", (await this.getProducts()).payload);
            return "Successfully wrote products";
        } catch (error) {
            return error;
        }
    };

    checkLoadedFile = async () => {
        if (!this.products) {
            await this.readProductsFromFile();
        }
    };

    getProducts = async (query = {}) => {
        try {
            let { limit, page, sort, category, available } = query;
            limit = parseInt(limit);
            page = parseInt(page);

            await this.checkLoadedFile();
            let products = [...this.products];
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

            if (limit) {
                if (page) {
                    const startIndex = (page - 1) * limit;
                    const endIndex = page * limit;
                    products = products.slice(startIndex, endIndex);
                } else {
                    products = products.slice(0, limit);
                }
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
    };

    getProductById = async (id) => {
        try {
            await this.checkLoadedFile();
            const productFind = this.products.find((product) => product.id === id);
            if (productFind) {
                return { status: "success", payload: productFind };
            } else {
                return { status: "badRequest", message: "Product not found" };
            }
        } catch (error) {
            logger.error(`Error while processing request: ${error}`);
            return { status: "error", message: "Internal Server Error" };
        }
    };

    addProduct = async (product) => {
        let title = product.title;
        let description = product.description;
        let code = product.code;
        let price = product.price;
        let status = product.status;
        let stock = product.stock;
        let category = product.category;
        let thumbnail = product.thumbnail;

        try {
            await this.checkLoadedFile();

            // Validations
            if (!title || !description || !code || isNaN(price) || isNaN(stock) || !category) {
                return {
                    status: "badRequest",
                    message: "Error: Check required fields.",
                };
            }

            if (this.products.find((product) => product.code === code)) {
                return { status: "badRequest", message: "Code already exists" };
            }

            if (!(typeof status === "boolean")) {
                status = true;
            }

            let newProduct = {
                title,
                description,
                code,
                price: parseFloat(price), // Convert to a number
                status,
                stock: parseInt(stock), // Convert to an integer
                category,
                thumbnail,
                id: nanoid(8),
            };
            this.products.push(newProduct);
            await this.writeProductsToFile();
            return { status: "success", message: "Successfully added product" };
        } catch (error) {
            logger.error(`Error while processing request: ${error}`);
            return { status: "error", message: "Internal Server Error" };
        }
    };

    updateProduct = async (id, modifiedProduct) => {
        try {
            await this.checkLoadedFile();
            if (this.products.find((product) => product.id === id)) {
                const index = this.products.findIndex((product) => product.id === id);
                this.products[index] = {
                    ...this.products[index],
                    ...modifiedProduct,
                };
                await this.writeProductsToFile();
                return { status: "success", message: "Successfully updated product" };
            } else {
                return { status: "badRequest", message: "Product not found" };
            }
        } catch (error) {
            logger.error(`Error while processing request: ${error}`);
            return { status: "error", message: "Internal Server Error" };
        }
    };

    deleteProduct = async (id) => {
        try {
            await this.checkLoadedFile();
            if (this.products.find((product) => product.id === id)) {
                this.products = this.products.filter((product) => product.id !== id);
                await this.writeProductsToFile();
                let aa = await this.writeProductsToFile();
                console.log(aa);
                return { status: "success", message: "Successfully deleted product" };
            } else {
                return { status: "badRequest", message: "Product not found" };
            }
        } catch (error) {
            logger.error(`Error while processing request: ${error}`);
            return { status: "error", message: "Internal Server Error" };
        }
    };
}
