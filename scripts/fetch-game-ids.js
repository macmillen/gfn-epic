import dotenv from "dotenv";
import _igdb from "igdb-api-node";
import {
  calculateSimilarity,
  cleanseTitle,
  extractPrimaryTitle,
  printSuccess,
  readJson,
  writeJson,
} from "./utils.js";
import { verifyGameWithGemini } from "./gemini-matcher.js";

/** @type {import('igdb-api-node').default} */
const igdb = _igdb.default;

dotenv.config();

const idMapPath = "../src/data/generated/game-id-map.json";

const client = igdb(
  process.env.SECRET_TWITCH_CLIENT_ID,
  process.env.SECRET_TWITCH_ACCESS_TOKEN
);

const IGDB_CATEGORIES = {
  0: "Main Game",
  1: "DLC / Addon",
  2: "Expansion",
  3: "Bundle",
  4: "Standalone Expansion",
  5: "Mod",
  6: "Episode",
  7: "Season",
  8: "Remake",
  9: "Remaster",
  10: "Expanded Game",
  11: "Port",
  12: "Fork",
  13: "Pack",
  14: "Update",
};

const CANDIDATE_FIELDS = [
  "name",
  "category",
  "first_release_date",
  "summary",
  "alternative_names.name",
  "platforms.name",
];

const scoreCandidate = (candidate, item, primaryTitle) => {
  let score = 0;
  const nameClean = cleanseTitle(candidate.name);
  const titleClean = cleanseTitle(item.title);
  const primaryClean = cleanseTitle(primaryTitle);

  if (nameClean === titleClean) {
    score += 0.6;
  } else if (nameClean === primaryClean) {
    score += 0.45;
  } else {
    const simFull = calculateSimilarity(candidate.name, item.title);
    const simPrim = calculateSimilarity(candidate.name, primaryTitle);
    score += Math.max(simFull, simPrim) * 0.4;
  }

  if (candidate.altNames && candidate.altNames.length > 0) {
    for (const alt of candidate.altNames) {
      const altClean = cleanseTitle(alt);
      if (altClean === titleClean || altClean === primaryClean) {
        score += 0.4;
        break;
      }
    }
  }

  if (candidate.category === 0) {
    score += 0.25;
  } else if ([8, 9, 10].includes(candidate.category)) {
    score += 0.2;
  } else if ([1, 5].includes(candidate.category)) {
    score -= 0.4;
  }

  if (candidate.summary && (item.description || item.title)) {
    const text = (item.description || item.title).toLowerCase();
    const words = text.split(/\W+/).filter((w) => w.length > 4);
    const summaryLower = candidate.summary.toLowerCase();
    const matched = words.filter((w) => summaryLower.includes(w)).length;
    if (words.length > 0) {
      score += Math.min(0.15, (matched / words.length) * 0.15);
    }
  }

  return score;
};

const searchCandidates = async (title) => {
  const primaryTitle = extractPrimaryTitle(title);
  const candidatesMap = new Map();

  const addCandidates = (list) => {
    for (const item of list || []) {
      if (!candidatesMap.has(item.id)) {
        candidatesMap.set(item.id, {
          id: item.id,
          name: item.name,
          category: item.category,
          categoryName: IGDB_CATEGORIES[item.category] || "Unknown",
          year: item.first_release_date
            ? new Date(item.first_release_date * 1000).getFullYear()
            : undefined,
          altNames: item.alternative_names?.map((a) => a.name) || [],
          summary: item.summary,
        });
      }
    }
  };

  // Strategy 1: Search cleansed full title
  try {
    const res1 = await client
      .search(cleanseTitle(title))
      .fields(CANDIDATE_FIELDS)
      .limit(10)
      .request("https://api.igdb.com/v4/games");
    addCandidates(res1.data);
  } catch {}

  // Strategy 2: If primary title is different, search primary title
  if (primaryTitle && primaryTitle.toLowerCase() !== title.toLowerCase()) {
    try {
      const res2 = await client
        .search(cleanseTitle(primaryTitle))
        .fields(CANDIDATE_FIELDS)
        .limit(10)
        .request("https://api.igdb.com/v4/games");
      addCandidates(res2.data);
    } catch {}
  }

  // Strategy 3: Check exact title query `where name = "${name}"`
  // Crucial for short names like "Home" where full-text search ranks other games higher
  for (const nameToQuery of [title, primaryTitle]) {
    if (!nameToQuery) continue;
    try {
      const escaped = nameToQuery.replace(/"/g, '\\"');
      const res3 = await client
        .fields(CANDIDATE_FIELDS)
        .where(`name = "${escaped}"`)
        .limit(10)
        .request("https://api.igdb.com/v4/games");
      addCandidates(res3.data);
    } catch {}
  }

  // Strategy 4: Search alternative names if no candidate has exact title match
  const hasExactTitle = Array.from(candidatesMap.values()).some(
    (c) =>
      cleanseTitle(c.name) === cleanseTitle(title) ||
      (primaryTitle && cleanseTitle(c.name) === cleanseTitle(primaryTitle))
  );

  if (!hasExactTitle) {
    try {
      const altRes = await client
        .fields(["game.id"])
        .where(
          `name ~ *"${cleanseTitle(title)}"* | name ~ *"${cleanseTitle(primaryTitle)}"*`
        )
        .limit(5)
        .request("https://api.igdb.com/v4/alternative_names");
      const gameIds = altRes.data?.map((a) => a.game?.id).filter(Boolean);
      if (gameIds?.length) {
        const gamesRes = await client
          .fields(CANDIDATE_FIELDS)
          .where(`id = (${gameIds.join(",")})`)
          .request("https://api.igdb.com/v4/games");
        addCandidates(gamesRes.data);
      }
    } catch {}
  }

  const list = Array.from(candidatesMap.values());
  return list.sort((a, b) => {
    const aExact =
      cleanseTitle(a.name) === cleanseTitle(title) ||
      (primaryTitle && cleanseTitle(a.name) === cleanseTitle(primaryTitle));
    const bExact =
      cleanseTitle(b.name) === cleanseTitle(title) ||
      (primaryTitle && cleanseTitle(b.name) === cleanseTitle(primaryTitle));
    if (aExact && !bExact) return -1;
    if (!aExact && bExact) return 1;

    const aDlc = [1, 5, 13].includes(a.category);
    const bDlc = [1, 5, 13].includes(b.category);
    if (!aDlc && bDlc) return -1;
    if (aDlc && !bDlc) return 1;

    return 0;
  });
};

export const fetchGameIds = async () => {
  const dataObjects = readJson("../src/data/generated/data-objects.json");

  for (let i = 0; i < dataObjects.length; i++) {
    const item = dataObjects[i];
    const gameIdMap = readJson(idMapPath);

    // Manual override directly in dataObjects
    if (item.id) {
      gameIdMap[item.title] = item.id;
      writeJson(idMapPath, gameIdMap);
      continue;
    }

    // Skip already resolved valid IDs (null entries will be retried)
    if (
      gameIdMap[item.title] !== undefined &&
      gameIdMap[item.title] !== null
    ) {
      continue;
    }

    console.log(`\nProcessing: "${item.title}"`);
    const candidates = await searchCandidates(item.title);
    const primaryTitle = extractPrimaryTitle(item.title);

    let chosenId = null;

    if (candidates.length === 0) {
      console.log(
        "\x1b[31m%s\x1b[0m",
        `[NO CANDIDATES] Could not find any IGDB entries for "${item.title}"`
      );
      gameIdMap[item.title] = null;
      writeJson(idMapPath, gameIdMap);
      continue;
    }

    // Check for unambiguous exact match
    const exactMatches = candidates.filter(
      (c) =>
        cleanseTitle(c.name) === cleanseTitle(item.title) &&
        [0, 8, 9, 10].includes(c.category)
    );

    if (exactMatches.length === 1 && candidates.length === 1) {
      chosenId = exactMatches[0].id;
      console.log(
        "\x1b[32m%s\x1b[0m",
        `[EXACT MATCH] "${exactMatches[0].name}" (ID: ${chosenId})`
      );
    } else {
      // Multiple candidates or non-trivial match: Verify with Gemini AI
      const aiResult = await verifyGameWithGemini({
        targetGame: item,
        candidates,
      });

      if (
        aiResult &&
        aiResult.selectedId &&
        (aiResult.confidence === "HIGH" || aiResult.confidence === "MEDIUM")
      ) {
        chosenId = aiResult.selectedId;
        const matchedCandidate = candidates.find((c) => c.id === chosenId);
        console.log(
          "\x1b[36m%s\x1b[0m",
          `[AI MATCH (${aiResult.confidence})] "${matchedCandidate?.name || chosenId}" (ID: ${chosenId}) - ${aiResult.reason}`
        );
      } else if (aiResult && aiResult.selectedId === null) {
        console.log(
          "\x1b[33m%s\x1b[0m",
          `[AI REJECT] ${aiResult.reason || "AI rejected all candidates"}`
        );
      } else {
        // Fallback to heuristic scoring
        console.log(
          "\x1b[35m%s\x1b[0m",
          `[FALLBACK] Using heuristic scoring for "${item.title}"`
        );
        let bestCandidate = null;
        let bestScore = -1;

        for (const candidate of candidates) {
          const score = scoreCandidate(candidate, item, primaryTitle);
          if (score > bestScore) {
            bestScore = score;
            bestCandidate = candidate;
          }
        }

        if (bestCandidate && bestScore >= 0.5) {
          chosenId = bestCandidate.id;
          console.log(
            "\x1b[33m%s\x1b[0m",
            `[HEURISTIC MATCH] "${bestCandidate.name}" (ID: ${chosenId}) Score: ${bestScore.toFixed(2)}`
          );
        } else {
          console.log(
            "\x1b[31m%s\x1b[0m",
            `[UNRESOLVED] Low confidence for "${item.title}" (Best score: ${bestScore.toFixed(2)})`
          );
        }
      }
    }

    gameIdMap[item.title] = chosenId;
    writeJson(idMapPath, gameIdMap);
  }

  printSuccess("fetch game ids");
};
