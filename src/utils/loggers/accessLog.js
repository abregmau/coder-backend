import morgan from "morgan";
import fs from "fs";

// Create a write stream to save logs to a file
const accessLogStream = fs.createWriteStream("./src/logs/access.log", {
    flags: "a",
});

// Configure morgan to use the write stream for logging
let morganScript = morgan("combined", { stream: accessLogStream });

export default morganScript;
