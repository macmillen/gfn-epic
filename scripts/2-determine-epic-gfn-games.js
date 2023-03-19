import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import freeEpicGames from "../src/data/1-recent-data.json" assert { type: "json" };
import gfnGames from "../src/data/gfn-games.json" assert { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const result = freeEpicGames.map((freeEpicGame) => {
  const isGeforceNow = !!gfnGames.find(
    (gfnGame) =>
      gfnGame.toLowerCase().includes(freeEpicGame.title.toLowerCase()) &&
      gfnGame.includes("Epic Games Store")
  );

  return { ...freeEpicGame, ...(isGeforceNow ? { isGeforceNow } : {}) };
});

fs.writeFileSync(
  path.join(__dirname, "../src/data/2-epic-gfn-data.json"),
  JSON.stringify(result, null, 2)
);
