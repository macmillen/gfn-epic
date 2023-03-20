import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const readJson = (filePath) => {
  try {
    const jsonStr = readFileSync(path.join(__dirname, filePath));
    return JSON.parse(jsonStr);
  } catch {
    return {};
  }
};

export const writeJson = (filePath, json) => {
  writeFileSync(path.join(__dirname, filePath), JSON.stringify(json, null, 2));
};

export const printSuccess = (message) => {
  console.log("\x1b[32m", message);
};
