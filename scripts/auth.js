import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const url =
  "https://id.twitch.tv/oauth2/token?client_id=ekudgra8jxk7zom8rbxa3e8cca2h44&client_secret=x86l5fs16w4xiqpe2xf4awzmagg5ct&grant_type=client_credentials";

function setEnvVariable(key, value) {
  const envPath = join(__dirname, "../.env");
  const keyRegex = new RegExp(`^${key}=.*$`, "m");

  let envContent = readFileSync(envPath, "utf8");

  envContent = envContent.replace(keyRegex, `${key}=${value}`);
  writeFileSync(envPath, envContent);
}

fetch(url, { method: "POST" })
  .then((response) => response.json())
  .then((data) => {
    const accessToken = data.access_token;

    setEnvVariable("SECRET_TWITCH_ACCESS_TOKEN", accessToken);
  });
