class ProductManager {
  constructor() {
    this.products = [];
  }

  static id = 0;

  addProduct(title, description, price, thumbnail, code, stock) {
    //Verify that the code does not exist in the products array
    if (this.products.find((product) => product.code === code)) {
      console.log("Product code already exists");
      return;
    }

    //Validate that all fields are loaded
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.log("All fields are required");
      return;
    }

    this.products.push({
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      id: ++ProductManager.id,
    });
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    if (this.products.find((product) => product.id === id)) {
      return this.products.find((product) => product.id === id);
    } else {
      return "Product not found";
    }
  }
}

const products = new ProductManager();

//First call
console.log(products.getProducts());

//Add product first product
products.addProduct(
  "producto prueba",
  "Este es un producto prueba",
  200,
  "Sin imagen",
  "abc123",
  25
);

//Add product second product
products.addProduct(
  "producto prueba 2",
  "Este es un producto prueba 2",
  200,
  "Sin imagen",
  "abc124",
  25
);

//Second call
console.log(products.getProducts());

//Get product by id
const productId = 1; // Replace with the desired product id
const product = products.getProductById(productId);
console.log(product);
