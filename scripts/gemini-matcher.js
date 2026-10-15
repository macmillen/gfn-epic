import dotenv from "dotenv";

dotenv.config();

const GEMINI_MODELS = ["gemini-flash-latest", "gemini-3.5-flash"];

/**
 * Uses Gemini AI to determine which IGDB candidate best matches the Epic Games title.
 * @param {Object} params
 * @param {Object} params.targetGame - The game from Epic ({ title, description, seller, fromDate })
 * @param {Array<Object>} params.candidates - The IGDB candidates found
 * @returns {Promise<{ selectedId: number|null, confidence: string, reason: string } | null>}
 */
export const verifyGameWithGemini = async ({ targetGame, candidates }) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }

  if (!candidates || candidates.length === 0) {
    return {
      selectedId: null,
      confidence: "NONE",
      reason: "No IGDB candidates provided",
    };
  }

  const prompt = `You are an expert video game database matching system.
An Epic Games Store promotional game needs to be matched to its exact IGDB database entry.
Analyze the target game and the candidate list below to select the exact matching game.

Target Game (from Epic Games Store):
- Title: "${targetGame.title}"
${targetGame.description ? `- Description: "${targetGame.description}"` : ""}
${targetGame.seller ? `- Publisher/Seller: "${targetGame.seller}"` : ""}
${targetGame.fromDate ? `- Promotion Date: "${targetGame.fromDate}"` : ""}

IGDB Candidates:
${candidates
  .slice(0, 25)
  .map(
    (c, i) =>
      `${i + 1}. ID: ${c.id}
   Name: "${c.name}"
   Category: ${c.categoryName || c.category || "Unknown"}
   Release Year: ${c.year || "Unknown"}
   ${c.altNames?.length ? `Alternative Names: ${JSON.stringify(c.altNames)}` : ""}
   ${c.summary ? `Summary: "${c.summary.replace(/\n+/g, " ").slice(0, 300)}"` : ""}`
  )
  .join("\n\n")}

CRITICAL RULES:
1. Free weekly games from Epic are full base games (or remasters/remakes/bundles), NOT cosmetic DLC packs or standalone skins.
2. Beware of games with identical names released in different years (e.g. 1990s retro games vs modern releases).
3. If an Epic title has a subtitle/tagline omitted in the IGDB main title, verify using the Alternative Names or Summary.
4. If none of the candidates are the actual game, set selectedId to null.

Return your response in this exact JSON schema:
{
  "selectedId": number or null,
  "confidence": "HIGH" | "MEDIUM" | "LOW" | "NONE",
  "reason": "Clear explanation of why this candidate was chosen or rejected"
}
Output only the JSON object.`;

  for (const model of GEMINI_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(10000),
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.1,
          },
        }),
      });

      if (!response.ok) {
        continue;
      }

      const data = await response.json();
      const parts = data.candidates?.[0]?.content?.parts || [];
      const textPart = parts.find((p) => p.text && !p.thought);
      const rawText = textPart?.text || parts[parts.length - 1]?.text;

      if (!rawText) continue;

      const parsed = JSON.parse(rawText.trim());
      if (typeof parsed.selectedId !== "undefined") {
        return parsed;
      }
    } catch {
      // Try next model if timeout or error
      continue;
    }
  }

  return null;
};
