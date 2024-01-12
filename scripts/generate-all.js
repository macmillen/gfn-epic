import { fetchGameData } from "./fetch-game-data.js";
import { fetchGameIds } from "./fetch-game-ids.js";
import { fetchGfnData } from "./fetch-gfn-data.js";
import { generateFinalData } from "./generate-final-data.js";

await fetchGfnData();
await fetchGameIds();
await fetchGameData();
generateFinalData();
