// @ts-check
const vscode = require("vscode");
const { sendPromptToChat } = require("./chatInsert");
const { pickPrompt, pickPromptTwoStep } = require("./promptStore");

/**
 * @param {import('./promptStore').PromptEntry} entry
 */
async function insertPromptEntry(entry) {
  const result = await sendPromptToChat(entry.text);
  if (result === "filled") {
    vscode.window.showInformationMessage(
      `Cursor Chat Prompt Library RU: «${entry.label}» вставлен в чат.`
    );
    return;
  }

  vscode.window.showWarningMessage(
    `Cursor Chat Prompt Library RU: не удалось открыть чат автоматически. Промпт «${entry.label}» в буфере — откройте чат (Ctrl+L) и вставьте (Ctrl+V).`
  );
}

/**
 * @param {vscode.ExtensionContext} context
 * @param {string | undefined} category
 */
async function runPickAndInsert(context, category) {
  const entry = await pickPrompt(context, category);
  if (!entry) {
    return;
  }
  await insertPromptEntry(entry);
}

/**
 * @param {vscode.ExtensionContext} context
 */
async function runPickTwoStepAndInsert(context) {
  const entry = await pickPromptTwoStep(context);
  if (!entry) {
    return;
  }
  await insertPromptEntry(entry);
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand("cursorChatPromptLibraryRu.pick", () =>
      runPickTwoStepAndInsert(context)
    ),
    vscode.commands.registerCommand("cursorChatPromptLibraryRu.insert", () =>
      runPickAndInsert(context, undefined)
    ),
    vscode.commands.registerCommand(
      "cursorChatPromptLibraryRu.insertWebsite",
      () => runPickAndInsert(context, "website")
    ),
    vscode.commands.registerCommand("cursorChatPromptLibraryRu.insertPython", () =>
      runPickAndInsert(context, "python")
    ),
    vscode.commands.registerCommand(
      "cursorChatPromptLibraryRu.insertJavaScript",
      () => runPickAndInsert(context, "javascript")
    )
  );
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
