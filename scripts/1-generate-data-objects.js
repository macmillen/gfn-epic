import { printSuccess, readJson, writeJson } from "./utils.js";

export const generateDataObjects = () => {
  const gfnGames = readJson("../src/data/gfn-games.json");
  const initData = readJson("../src/data/init-data.json");

  const result = initData.map((data) => {
    const fromDate = data.slice(0, 10);
    const untilDate = data.slice(13, 23);
    const title = data.slice(25);

    const isGeforceNow = !!gfnGames.find(
      (gfnGame) =>
        gfnGame.toLowerCase().includes(title.toLowerCase()) &&
        gfnGame.includes("Epic Games Store")
    );

    return {
      title,
      fromDate,
      untilDate,
      ...(isGeforceNow ? { isGeforceNow } : {}),
    };
  });

  writeJson("../src/data/generated/1-data-objects.json", result);

  printSuccess("generate data objects [SUCCESS]");
};
