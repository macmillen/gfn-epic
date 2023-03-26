import { fetchGameIds } from "./2-fetch-game-ids.js";
import { fetchGameData } from "./3-fetch-game-data.js";
import { generateFinalData } from "./4-generate-final-data.js";

await fetchGameIds();
await fetchGameData();
generateFinalData();
