import dotenv from "dotenv";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const url = `https://id.twitch.tv/oauth2/token?client_id=${process.env.SECRET_TWITCH_CLIENT_ID}&client_secret=${process.env.SECRET_TWITCH_KEY}&grant_type=client_credentials`;

function setEnvVariable(key: string, value: string) {
  const envPath = join(__dirname, "../.env");
  const keyRegex = new RegExp(`^${key}=.*$`, "m");

  let envContent = readFileSync(envPath, "utf8");

  envContent = envContent.replace(keyRegex, `${key}=${value}`);
  writeFileSync(envPath, envContent);
}

try {
  const response = await fetch(url, { method: "POST" });
  const data = await response.json();

  if (!response.ok || !data.access_token) {
    console.error(
      "\x1b[31m%s\x1b[0m",
      `[ERROR] Twitch authentication failed: ${data.message || JSON.stringify(data)}`
    );
    process.exit(1);
  }

  setEnvVariable("SECRET_TWITCH_ACCESS_TOKEN", data.access_token);
  console.log(
    "\x1b[32m%s\x1b[0m",
    "[SUCCESS] Twitch access token obtained and saved to .env"
  );
} catch (err: any) {
  console.error(
    "\x1b[31m%s\x1b[0m",
    `[ERROR] Failed to authenticate with Twitch: ${err.message}`
  );
  process.exit(1);
}
