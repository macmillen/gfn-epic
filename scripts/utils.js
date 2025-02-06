import { createWriteStream, existsSync, readFileSync, writeFileSync } from "fs";
import { mkdir } from "fs/promises";
import path from "path";
import { Readable } from "stream";
import { finished } from "stream/promises";
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
  console.log("\x1b[32m", `[SUCCESS] ${message}`);
};

export const downloadFile = async (url, fileName, folderPath) => {
  if (!url) return;
  if (!existsSync(folderPath)) await mkdir(folderPath);
  const destination = path.resolve(`./${folderPath}`, fileName);
  if (existsSync(destination)) return;

  try {
    const res = await fetch(url);
    const fileStream = createWriteStream(destination, { flags: "wx" });
    await finished(Readable.fromWeb(res.body).pipe(fileStream));
  } catch {
    console.log("a file download failed");
  }
};

export const cleanseTitle = (title) => {
  return title
    .replaceAll("™", "")
    .replaceAll("®", "")
    .replaceAll("©", "")
    .replaceAll(":", "")
    .replaceAll("-", "")
    .replaceAll("：", " ")
    .replaceAll("​", "")
    .replaceAll("’", "")
    .replaceAll("'", "")
    .toLowerCase();
};
