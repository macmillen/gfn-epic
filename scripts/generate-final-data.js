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
  const gameDataObjects = readJson("../src/data/generated/data-objects.json");
  const gameIdMap = readJson("../src/data/generated/game-id-map.json");
  const igdbGameDataMap = readJson(
    "../src/data/generated/igdb-game-data-map.json"
  );
  const gfnGames = readJson("../src/data/generated/gfn-data.json");
  const oldFinalData = readJson("../src/data/generated/final-data.json");

  const result = gameDataObjects.flatMap((data) => {
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

    if (gfnItem) {
      const newGfnTitle = oldFinalData.find(({ gfnUrl }) =>
        gfnUrl?.includes(gfnItem.id)
      );

      if (!newGfnTitle) {
        console.log("\x1b[36m%s\x1b[0m", `New GFN title: ${gfnItem.title}`);
      }
    }

    if (data.hidden) {
      return [];
    }

    if (data.mysteryGame) {
      return {
        title: "Mystery Game",
        fromDate: data.fromDate,
        untilDate: data.untilDate,
        mysteryGame: true,
        data: {
          cover: "/mystery-game.png",
        },
      };
    }

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

  writeJson("../src/data/generated/final-data.json", result);

  printSuccess("generate final data");
};
