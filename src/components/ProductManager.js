import { promises as fs } from "fs";

export default class ProductManager {
    constructor() {
        this.patch = "./products.txt";
        this.products = [];
    }

    static id = 0;

    addProduct = async (title, description, price, thumbnail, code, stock) => {
        let newProduct = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            id: ++ProductManager.id,
        };

        this.products.push(newProduct);

        await fs.writeFile(this.patch, JSON.stringify(this.products));
    };

    getProducts = async () => {
        const products = await fs.readFile(this.patch, "utf-8");
        return JSON.parse(products);
    };

    getProductById = async (id) => {
        const products = await this.getProducts();
        if (products.find((product) => product.id === id)) {
            return products.find((product) => product.id === id);
        } else {
            return "Product not found";
        }
    };

    updateProduct = async (id, modifiedProduct) => {
        const products = await this.getProducts();
        if (products.find((product) => product.id === id)) {
            const index = products.findIndex((product) => product.id === id);
            products[index] = { ...products[index], ...modifiedProduct };
            await fs.writeFile(this.patch, JSON.stringify(products));
        } else {
            return "Product not found";
        }
    };

    deleteProduct = async (id) => {
        const products = await this.getProducts();
        if (products.find((product) => product.id === id)) {
            const newProducts = products.filter((product) => product.id !== id);
            await fs.writeFile(this.patch, JSON.stringify(newProducts));
        } else {
            return "Product not found";
        }
    };
}

// const products = new ProductManager();

// products.addProduct("Title1", "Description1", 150, "url1", "abc121", 20);
// products.addProduct("Title2", "Description2", 150, "url2", "abc122", 20);
// products.addProduct("Title3", "Description3", 150, "url3", "abc123", 20);
// products.addProduct("Title4", "Description4", 150, "url4", "abc124", 20);
// products.addProduct("Title5", "Description5", 150, "url5", "abc125", 20);
// products.addProduct("Title6", "Description6", 150, "url6", "abc126", 20);
// products.addProduct("Title7", "Description7", 150, "url7", "abc127", 20);
// products.addProduct("Title8", "Description8", 150, "url8", "abc128", 20);
// products.addProduct("Title9", "Description9", 150, "url9", "abc129", 20);
