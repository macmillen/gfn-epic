import { generateDataObjects } from "./1-generate-data-objects.js";
import { fetchGameIds } from "./2-fetch-game-ids.js";
import { fetchGameData } from "./3-fetch-game-data.js";
import { generateFinalData } from "./4-generate-final-data.js";

generateDataObjects();
await fetchGameIds();
await fetchGameData();
generateFinalData();
