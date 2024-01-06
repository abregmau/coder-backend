import { promises as fs } from "fs";

class ProductManager {
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

const products = new ProductManager();

// products.addProduct("Title1", "Description1", 100, "url1", "abc123", 10);
// products.addProduct("Title2", "Description2", 150, "url2", "abc124", 20);

// products.getProducts().then((data) => console.log(data));
// products.getProductById(4).then((data) => console.log(data));

// products.deleteProduct(1).then((data) => console.log(data));
// products.getProducts().then((data) => console.log(data));

products.updateProduct(1, {
  price: 130,
});
