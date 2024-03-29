import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirUtil = path.dirname(__filename);
const __dirname = path.resolve(__dirUtil, "../..");

export default __dirname;
