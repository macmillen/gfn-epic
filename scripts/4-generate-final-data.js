import { printSuccess, readJson, writeJson } from "./utils.js";

const cleanseTitle = (title) => {
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

export const generateFinalData = () => {
  const gameDataObjects = readJson("../src/data/generated/1-data-objects.json");
  const gameIdMap = readJson("../src/data/generated/2-game-id-map.json");
  const igdbGameDataMap = readJson(
    "../src/data/generated/3-igdb-game-data-map.json"
  );
  const gfnGames = readJson("../src/data/generated/gfn-data.json");

  const result = gameDataObjects.map((data) => {
    const igdbGameData = igdbGameDataMap[gameIdMap[data.title]];

    const gfnItem = gfnGames.find((gfnGame) => {
      const isEpic = gfnGame.variants.some((v) => v.appStore === "EPIC");
      const titles = [
        cleanseTitle(data.title),
        cleanseTitle(igdbGameData?.name ?? ""),
        ...(igdbGameData?.alternative_names ?? []).map((v) =>
          cleanseTitle(v.name)
        ),
      ];

      return titles.some((t) => t === cleanseTitle(gfnGame.title)) && isEpic;
    });
    return {
      title: igdbGameData?.name ?? data.title,
      fromDate: data.fromDate,
      untilDate: data.untilDate,
      ...(gfnItem || data.gfnId
        ? {
            gfnUrl: `https://play.geforcenow.com/games?game-id=${
              data.gfnId ?? gfnItem.id
            }`,
          }
        : {}),
      id: gameIdMap[data.title],
      data: igdbGameData,
    };
  });

  writeJson("../src/data/generated/4-final-data.json", result);

  printSuccess("generate final data [SUCCESS]");
};
