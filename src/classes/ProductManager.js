import { promises as fs } from "fs";
import { nanoid } from "nanoid";

export default class ProductManager {
    constructor() {
        this.patch = "./src/models/products.json";
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
        } catch (error) {
            return error;
        }
    };

    checkLoadedFile = async () => {
        if (!this.products) {
            await this.readProductsFromFile();
        }
    };

    getProducts = async () => {
        await this.checkLoadedFile();
        return this.products;
    };

    getProductById = async (id) => {
        await this.checkLoadedFile();
        const productId = this.products.find((product) => product.id === id);
        if (productId) {
            return { status: true, product: productId };
        } else {
            return { status: false, message: "Product not found" };
        }
    };

    addProduct = async (
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnail
    ) => {
        await this.checkLoadedFile();

        // Validations
        if (
            !title ||
            !description ||
            !code ||
            isNaN(price) ||
            isNaN(stock) ||
            !category
        ) {
            return {
                status: false,
                message: "Error: Check required fields.",
            };
        }

        if (this.products.find((product) => product.code === code)) {
            return { status: false, message: "Code already exists" };
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
        return { status: true, message: "Successfully added product" };
    };

    updateProduct = async (id, modifiedProduct) => {
        await this.checkLoadedFile();
        if (this.products.find((product) => product.id === id)) {
            const index = this.products.findIndex(
                (product) => product.id === id
            );
            this.products[index] = {
                ...this.products[index],
                ...modifiedProduct,
            };
            await this.writeProductsToFile();
            return { status: true, message: "Successfully updated product" };
        } else {
            return { status: false, message: "Product not found" };
        }
    };

    deleteProduct = async (id) => {
        await this.checkLoadedFile();
        if (this.products.find((product) => product.id === id)) {
            this.products = this.products.filter(
                (product) => product.id !== id
            );
            await this.writeProductsToFile();
            return { status: true, message: "Successfully deleted product" };
        } else {
            return { status: false, message: "Product not found" };
        }
    };
}
