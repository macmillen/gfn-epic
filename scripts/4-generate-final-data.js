import { printSuccess, readJson, writeJson } from "./utils.js";

export const generateFinalData = () => {
  const gameDataObjects = readJson("../src/data/generated/1-data-objects.json");
  const gameIdMap = readJson("../src/data/generated/2-game-id-map.json");
  const igdbGameDataMap = readJson(
    "../src/data/generated/3-igdb-game-data-map.json"
  );

  const result = gameDataObjects.map((data) => ({
    ...data,
    id: gameIdMap[data.title],
    data: igdbGameDataMap[gameIdMap[data.title]],
  }));

  writeJson("../src/data/generated/4-final-data.json", result);

  printSuccess("generate final data [SUCCESS]");
};
