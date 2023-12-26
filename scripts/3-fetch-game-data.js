import dotenv from "dotenv";
import _igdb from "igdb-api-node";
import { downloadFile, printSuccess, readJson, writeJson } from "./utils.js";

dotenv.config();

/** @type {import('igdb-api-node').default} */
const igdb = _igdb.default;

const client = igdb(
  process.env.SECRET_TWITCH_CLIENT_ID,
  process.env.SECRET_TWITCH_ACCESS_TOKEN
);

export const fetchGameData = async () => {
  const gameIdMap = readJson("../src/data/generated/2-game-id-map.json");

  const ids = Object.values(gameIdMap)
    .filter((v) => v !== null)
    .join(",");

  const response = await client
    .fields([
      "name",
      "cover.*",
      "first_release_date",
      "genres.*",
      "total_rating",
      "alternative_names.name",
      "summary",
      "websites.*",
      "age_ratings.*",
    ])
    .where(`id = (${ids})`)
    .limit(500)
    .request("https://api.igdb.com/v4/games");

  const getCover = (responseData, replaceWith) => {
    return responseData.cover
      ? "https:" + responseData.cover.url.replace("t_thumb", replaceWith)
      : undefined;
  };

  const result = response.data.reduce((acc, responseData) => {
    const coverSmallLink = getCover(responseData, "t_cover_small");
    const coverBigLink = getCover(responseData, "t_cover_big");

    downloadFile(
      coverSmallLink,
      `${responseData.id}_small.jpg`,
      "public/game-images"
    );
    downloadFile(
      coverBigLink,
      `${responseData.id}_big.jpg`,
      "public/game-images"
    );

    return {
      ...acc,
      [responseData.id]: {
        id: responseData.id,
        cover: `/game-images/${responseData.id}_small.jpg`,
        coverBig: getCover(responseData, "t_cover_big"),
        alternative_names: responseData.alternative_names,
        first_release_date: responseData.first_release_date
          ? new Date(responseData.first_release_date * 1000).toISOString()
          : undefined,
        genres: responseData.genres?.map(({ name }) => name),
        name: responseData.name,
        rating: responseData.total_rating,
        summary: responseData.summary,
        age_ratings: responseData.age_ratings,
        websites: responseData.websites?.map((d) => ({
          url: d.url,
          category: d.category,
        })),
      },
    };
  }, {});

  writeJson("../src/data/generated/3-igdb-game-data-map.json", result);

  printSuccess("fetch game data [SUCCESS]");
};
