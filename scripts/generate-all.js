import { fetchGfnData } from "./1-fetch-gfn-data.js";
import { fetchGameIds } from "./2-fetch-game-ids.js";
import { fetchGameData } from "./3-fetch-game-data.js";
import { generateFinalData } from "./4-generate-final-data.js";

await fetchGfnData();
await fetchGameIds();
await fetchGameData();
generateFinalData();
