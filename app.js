import express from "express";
import ProductManager from "./src/components/ProductManager.js";

const app = express();
app.use(express.urlencoded({ extended: true }));

const products = new ProductManager();

app.get("/products", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const readProducts = await products.getProducts();

    if (!limit) {
      res.send(readProducts);
    } else {
      let productsLimit = readProducts.slice(0, limit);
      res.send(productsLimit);
    }
  } catch (error) {
    console.error(`Error while processing request: ${error}`);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/products/:pid", async (req, res) => {
  let product = await products.getProductById(parseInt(req.params.pid));
  if (!product) {
    res.send({ error: "Product not found" });
  } else {
    res.send(product);
  }
});

const PORT = 8080;
const server = app.listen(PORT, () => {
  console.log(`Server Listening in port: ${server.address().port}`);
});
server.on("error", (error) => console.log(`Server error: ${error}`));
