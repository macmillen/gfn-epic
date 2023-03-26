import { printSuccess, readJson, writeJson } from "./utils.js";

export const generateFinalData = () => {
  const gameDataObjects = readJson("../src/data/generated/1-data-objects.json");
  const gameIdMap = readJson("../src/data/generated/2-game-id-map.json");
  const igdbGameDataMap = readJson(
    "../src/data/generated/3-igdb-game-data-map.json"
  );
  const gfnGames = readJson("../src/data/gfn-games.json");

  const result = gameDataObjects.map((data) => {
    const igdbGameData = igdbGameDataMap[gameIdMap[data.title]];
    const isGeforceNow = !!gfnGames.find(
      (gfnGame) =>
        gfnGame.toLowerCase().includes(data.title.toLowerCase()) &&
        gfnGame.includes("Epic Games Store")
    );
    return {
      title: igdbGameData?.name ?? data.title,
      fromDate: data.fromDate,
      untilDate: data.untilDate,
      ...(isGeforceNow ? { isGeforceNow } : {}),
      id: gameIdMap[data.title],
      data: igdbGameData,
    };
  });

  writeJson("../src/data/generated/4-final-data.json", result);

  printSuccess("generate final data [SUCCESS]");
};
