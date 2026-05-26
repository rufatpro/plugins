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
      `Cursor Chat Prompt Library: "${entry.label}" inserted into chat.`
    );
    return;
  }

  vscode.window.showWarningMessage(
    `Cursor Chat Prompt Library: could not open chat automatically. Prompt "${entry.label}" is in clipboard — open chat (Ctrl+L) and paste (Ctrl+V).`
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
    vscode.commands.registerCommand("cursorChatPromptLibrary.pick", () =>
      runPickTwoStepAndInsert(context)
    ),
    vscode.commands.registerCommand("cursorChatPromptLibrary.insert", () =>
      runPickAndInsert(context, undefined)
    ),
    vscode.commands.registerCommand(
      "cursorChatPromptLibrary.insertWebsite",
      () => runPickAndInsert(context, "website")
    ),
    vscode.commands.registerCommand("cursorChatPromptLibrary.insertPython", () =>
      runPickAndInsert(context, "python")
    ),
    vscode.commands.registerCommand(
      "cursorChatPromptLibrary.insertJavaScript",
      () => runPickAndInsert(context, "javascript")
    )
  );
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
