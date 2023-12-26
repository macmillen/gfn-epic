import dotenv from "dotenv";
import _igdb from "igdb-api-node";
import { printSuccess, readJson, writeJson } from "./utils.js";
/** @type {import('igdb-api-node').default} */
const igdb = _igdb.default;

dotenv.config();

const idMapPath = "../src/data/generated/2-game-id-map.json";

const client = igdb(
  process.env.SECRET_TWITCH_CLIENT_ID,
  process.env.SECRET_TWITCH_ACCESS_TOKEN
);

export const fetchGameIds = async () => {
  const dataObjects = readJson("../src/data/generated/1-data-objects.json");

  for (let i = 0; i < dataObjects.length; i++) {
    const item = dataObjects[i];
    const gameIdMap = readJson(idMapPath);

    // we set the igdb id manually in the data
    if (item.id) {
      gameIdMap[item.title] = item.id;
      writeJson(idMapPath, gameIdMap);
      continue;
    }

    if (gameIdMap[item.title] !== undefined) continue;

    const { title, id } = item;

    const response = await client
      .search(title)
      .fields("name")
      .request("https://api.igdb.com/v4/games");

    const responseData =
      response.data.find((v) => v.name === item.title) ?? response.data[0];

    console.log("\x1b[36m%s\x1b[0m", `Search Result: ${responseData?.name}`);
    console.log(
      "\x1b[31m",
      `${
        responseData?.name !== item.title ? `NOT MATCHING: ${item.title}` : ""
      }`
    );

    gameIdMap[item.title] = id ?? responseData?.id ?? null;
    writeJson(idMapPath, gameIdMap);
  }

  printSuccess("fetch game ids [SUCCESS]");
};
