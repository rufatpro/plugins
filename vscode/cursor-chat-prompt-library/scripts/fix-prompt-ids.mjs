/**
 * Fix batch-2 prompt ids (11–20) to {prefix}-11 … {prefix}-20.
 * Run: node scripts/fix-prompt-ids.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { prefixFromFirstId } from "./prompt-id-utils.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const promptsDir = path.join(__dirname, "..", "prompts");

for (const file of fs.readdirSync(promptsDir).filter((f) => f.endsWith(".json"))) {
  const filePath = path.join(promptsDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const prefix = prefixFromFirstId(data.prompts[0].id);

  data.prompts.forEach((prompt, index) => {
    const n = index + 1;
    if (n <= 10) {
      return;
    }
    prompt.id = `${prefix}-${String(n).padStart(2, "0")}`;
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
  console.log(`fixed ${file} (${data.prompts.length} prompts, prefix=${prefix})`);
}
