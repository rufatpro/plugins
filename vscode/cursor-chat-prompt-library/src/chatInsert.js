// @ts-check
const vscode = require("vscode");

const CHAT_OPEN_WITH_PROMPT = "workbench.action.chat.open";

const AI_OPEN_CHAT_FALLBACK = [
  "composer.newAgentChat",
  "composerMode.agent",
  "aichat.newchataction",
];

const AI_FOCUS_COMMANDS = ["composer.focusComposer", "aichat.focus"];

/** @param {number} ms */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * @param {string[]} ids
 * @returns {Promise<string | undefined>}
 */
async function findAvailableCommand(ids) {
  const all = await vscode.commands.getCommands(true);
  return ids.find((id) => all.includes(id));
}

/**
 * @param {string} prompt
 * @returns {Promise<boolean>}
 */
async function openChatWithPrompt(prompt) {
  const all = await vscode.commands.getCommands(true);
  if (!all.includes(CHAT_OPEN_WITH_PROMPT)) {
    return false;
  }
  for (const arg of [prompt, { query: prompt }]) {
    try {
      await vscode.commands.executeCommand(CHAT_OPEN_WITH_PROMPT, arg);
      return true;
    } catch {
      // try next argument shape
    }
  }
  return false;
}

/**
 * @param {string} prompt
 * @returns {Promise<boolean>}
 */
async function openChatAndInsertPrompt(prompt) {
  const openCmd = await findAvailableCommand(AI_OPEN_CHAT_FALLBACK);
  if (!openCmd) {
    return false;
  }

  const savedClipboard = await vscode.env.clipboard.readText().catch(() => "");
  await vscode.env.clipboard.writeText(prompt);

  try {
    await vscode.commands.executeCommand(openCmd);

    const focusCmd = await findAvailableCommand(AI_FOCUS_COMMANDS);
    if (focusCmd) {
      await vscode.commands.executeCommand(focusCmd);
    }

    for (const delayMs of [120, 280, 500]) {
      await sleep(delayMs);
      try {
        await vscode.commands.executeCommand(
          "editor.action.clipboardPasteAction"
        );
        return true;
      } catch {
        // chat input may not be ready yet
      }
      try {
        await vscode.commands.executeCommand("type", { text: prompt });
        return true;
      } catch {
        // fallback
      }
    }
    return false;
  } finally {
    setTimeout(() => {
      vscode.env.clipboard.writeText(savedClipboard).catch(() => {});
    }, 800);
  }
}

/**
 * @param {string} prompt
 * @returns {Promise<'filled' | 'clipboard'>}
 */
async function sendPromptToChat(prompt) {
  if (await openChatWithPrompt(prompt)) {
    return "filled";
  }

  if (await openChatAndInsertPrompt(prompt)) {
    return "filled";
  }

  await vscode.env.clipboard.writeText(prompt);
  return "clipboard";
}

module.exports = {
  sendPromptToChat,
};
