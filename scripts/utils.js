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

export const extractPrimaryTitle = (title) => {
  if (!title) return "";
  const clean = title.replace(/\s*\([^)]*\)/g, "").trim();
  const delimiterMatch = clean.match(/^(.+?)\s*(?:[-:—|])\s*(.+)$/);
  if (delimiterMatch && delimiterMatch[1].trim().length >= 2) {
    return delimiterMatch[1].trim();
  }
  return clean;
};

export const calculateSimilarity = (str1, str2) => {
  if (!str1 || !str2) return 0;
  const s1 = cleanseTitle(str1).replace(/\s+/g, "");
  const s2 = cleanseTitle(str2).replace(/\s+/g, "");
  if (s1 === s2) return 1;
  if (s1.length < 2 || s2.length < 2) return 0;

  const getBigrams = (str) => {
    const bigrams = new Map();
    for (let i = 0; i < str.length - 1; i++) {
      const bigram = str.substring(i, i + 2);
      bigrams.set(bigram, (bigrams.get(bigram) || 0) + 1);
    }
    return bigrams;
  };

  const b1 = getBigrams(s1);
  const b2 = getBigrams(s2);
  let intersection = 0;

  for (const [bigram, count1] of b1.entries()) {
    if (b2.has(bigram)) {
      intersection += Math.min(count1, b2.get(bigram));
    }
  }

  const total = s1.length - 1 + (s2.length - 1);
  return (2 * intersection) / total;
};

