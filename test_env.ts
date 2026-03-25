import "dotenv/config";
import fs from "fs";
import path from "path";

console.log("CWD:", process.cwd());
console.log(".env exists in CWD:", fs.existsSync(path.join(process.cwd(), ".env")));

const keys = Object.keys(process.env).filter(k => k.includes("OPENAI"));
console.log("Matching Keys in process.env:", keys);

if (keys.length > 0) {
    const val = process.env.OPENAI_API_KEY;
    console.log("OPENAI_API_KEY length:", val ? val.length : "undefined");
    if (val) {
        console.log("OPENAI_API_KEY starts with:", val.slice(0, 10));
        console.log("OPENAI_API_KEY ends with:", val.slice(-10));
    }
} else {
    console.log("No OPENAI keys found in process.env");
}
