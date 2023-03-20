import dotenv from "dotenv";
import _igdb from "igdb-api-node";
import { printSuccess, readJson, writeJson } from "./utils.js";

const gameIdMap = readJson("../src/data/generated/2-game-id-map.json");

dotenv.config();

/** @type {import('igdb-api-node').default} */
const igdb = _igdb.default;

const client = igdb(
  process.env.SECRET_TWITCH_CLIENT_ID,
  process.env.SECRET_TWITCH_ACCESS_TOKEN
);

const ids = Object.values(gameIdMap)
  .filter((v) => v !== null)
  .join(",");

export const fetchGameData = async () => {
  const response = await client
    .fields([
      "name",
      "cover.*",
      "first_release_date",
      "genres.*",
      "total_rating",
      "summary",
      "websites.*",
    ])
    .where(`id = (${ids})`)
    .limit(500)
    .request("https://api.igdb.com/v4/games");

  const result = response.data.reduce(
    (acc, responseData) => ({
      ...acc,
      [responseData.id]: {
        id: responseData.id,
        cover: responseData.cover
          ? "https:" +
            responseData.cover.url.replace("t_thumb", "t_cover_small")
          : undefined,
        first_release_date: responseData.first_release_date
          ? new Date(responseData.first_release_date * 1000).toISOString()
          : undefined,
        genres: responseData.genres?.map(({ name }) => name),
        name: responseData.name,
        rating: responseData.total_rating,
        summary: responseData.summary,
        websites: responseData.websites?.map((d) => ({
          url: d.url,
          category: d.category,
        })),
      },
    }),
    {}
  );

  writeJson("../src/data/generated/3-igdb-game-data-map.json", result);

  printSuccess("fetch game data [SUCCESS]");
};
