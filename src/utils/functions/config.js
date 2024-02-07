import { config } from "dotenv";

config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ecommerce";
const PORT = process.env.PORT || 8080;

export { MONGODB_URI, PORT };
