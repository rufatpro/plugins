/**
 * Append batch 2 prompts (11–20) to each prompts/*.json file.
 * Run: node scripts/append-batch-2.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { BATCH2 } from "./batch-2-prompts.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const promptsDir = path.join(__dirname, "..", "prompts");

import { prefixFromFirstId } from "./prompt-id-utils.mjs";

/**
 * @param {string} prefix
 * @param {number} n
 * @param {[string, string, string, string]} tuple
 */
function entry(prefix, n, [label, description, detail, text]) {
  return {
    id: `${prefix}-${String(n).padStart(2, "0")}`,
    label,
    description,
    detail,
    text: text.trim(),
  };
}

let totalAdded = 0;

for (const file of fs.readdirSync(promptsDir).filter((f) => f.endsWith(".json"))) {
  const filePath = path.join(promptsDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const key = data.category;
  const batch = BATCH2[key];

  if (!batch) {
    console.error(`No BATCH2 for category "${key}" in ${file}`);
    process.exit(1);
  }
  if (batch.length !== 10) {
    console.error(`BATCH2[${key}] must have 10 items, got ${batch.length}`);
    process.exit(1);
  }

  const existing = data.prompts.length;
  if (existing >= 20) {
    console.log(`skip ${file} (already ${existing} prompts)`);
    continue;
  }
  if (existing !== 10) {
    console.warn(`warn ${file}: expected 10 prompts before append, got ${existing}`);
  }

  const prefix = prefixFromFirstId(data.prompts[0].id);
  const start = existing + 1;
  const added = batch.map((tuple, i) => entry(prefix, start + i, tuple));
  data.prompts.push(...added);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
  totalAdded += added.length;
  console.log(`updated ${file}: ${existing} -> ${data.prompts.length}`);
}

console.log(`done, added ${totalAdded} prompts`);
