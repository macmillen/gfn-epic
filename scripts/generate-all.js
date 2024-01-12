import { fetchGameData } from "./fetch-game-data.js";
import { fetchGameIds } from "./fetch-game-ids.js";
import { fetchGfnData } from "./fetch-gfn-data.js";
import { fetchNewEpicGames } from "./fetch-new-epic-games.js";
import { generateFinalData } from "./generate-final-data.js";

await fetchNewEpicGames();
await fetchGfnData();
await fetchGameIds();
await fetchGameData();
generateFinalData();
