import dotenv from "dotenv";
import { readFileSync, writeFileSync } from "fs";
import _igdb from "igdb-api-node";
import path from "node:path";
import { fileURLToPath } from "url";
import json from "../src/data/2-epic-gfn-data.json" assert { type: "json" };

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('igdb-api-node').default} */
const igdb = _igdb.default;

const client = igdb(
  process.env.SECRET_TWITCH_CLIENT_ID,
  process.env.SECRET_TWITCH_ACCESS_TOKEN
);

const wait = (ms) => new Promise((rs) => setTimeout(rs, ms));

const getFileContent = () => {
  const fileContent = readFileSync(
    path.join(__dirname, "../src/data/3-enriched-data.json")
  ).toString();
  const fileJson = JSON.parse(fileContent);
  return fileJson;
};

for await (const item of (async function* () {
  const array = json;
  for (let i = 0; i < array.length; i++) {
    const item = array[i];
    const fileContent = getFileContent();
    if (fileContent.find((v) => v.title === item.title)) continue;

    await wait(200);
    yield array[i];
  }
})()) {
  const { title } = item;
  const response = await client
    .fields([
      "name",
      "cover.*",
      "first_release_date",
      "genres.*",
      "rating",
      "summary",
      "websites.*",
    ])
    .search(title)
    .request("https://api.igdb.com/v4/games");

  const responseData = response.data[0];

  console.log(responseData?.name);

  let data = {};
  if (responseData) {
    data = {
      id: responseData.id,
      cover:
        "https:" + responseData.cover?.url.replace("t_thumb", "t_cover_big"),
      first_release_date: responseData.first_release_date
        ? new Date(responseData.first_release_date * 1000).toISOString()
        : undefined,
      genres: responseData.genres?.map(({ name }) => name),
      name: responseData.name,
      rating: responseData.rating,
      summary: responseData.summary,
      websites: responseData.websites?.map((d) => ({
        url: d.url,
        category: d.category,
      })),
    };
  }

  const fileContent = getFileContent();

  writeFileSync(
    path.join(__dirname, "../src/data/3-enriched-data.json"),
    JSON.stringify([...fileContent, { ...item, data }], null, 2)
  );
}
