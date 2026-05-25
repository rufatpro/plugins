// @ts-check
const vscode = require("vscode");

/** Cursor: new chat tab + editor selection as @-mentions (line links). */
const CHAT_WITH_SELECTION = "composer.addsymbolstonewcomposer";

/** Cursor: new agent chat with insertSelection from active editor. */
const CHAT_NEW_AGENT_WITH_SELECTION = "composer.newAgentChat";

/** Cursor: opens Composer with partialState.text (no selection chips). */
const CHAT_OPEN_WITH_PROMPT = "workbench.action.chat.open";

/** Fallback: open chat then paste. */
const AI_OPEN_CHAT_FALLBACK = [
  CHAT_NEW_AGENT_WITH_SELECTION,
  "composerMode.agent",
  "aichat.newchataction",
];

const AI_FOCUS_COMMANDS = ["composer.focusComposer", "aichat.focus"];

/** @param {number} ms */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Cursor Quick Edit (Ctrl+K) — inline prompt bar in the editor. */
const QUICK_EDIT_COMMANDS = [
  "editor.cmdk.show",
  "aipopup.action.modal.generate",
  "aipopup.action.focusEdit",
  "editor.action.inlineChat.start",
];

const MODULE_FILE_EXCLUDES =
  "{**/node_modules/**,**/.git/**,**/__pycache__/**,**/dist/**,**/build/**}";

/** Code action kind used to filter the in-editor menu. */
const QUICK_INTENT_KIND =
  vscode.CodeActionKind.QuickFix.append("pythonQuickIntent");

/** @type {vscode.Range | undefined} */
let lastIntentRange;

/**
 * @param {string[]} ids
 * @returns {Promise<string | undefined>}
 */
async function findAvailableCommand(ids) {
  const all = await vscode.commands.getCommands(true);
  return ids.find((id) => all.includes(id));
}

/**
 * @returns {import("vscode").TextEditor | undefined}
 */
function getPythonEditor() {
  const editor = vscode.window.activeTextEditor;
  if (!editor || editor.document.languageId !== "python") {
    vscode.window.showInformationMessage(
      "Python Quick Intent: open a Python file first."
    );
    return undefined;
  }
  return editor;
}

/**
 * Diagnostics (squiggles) at the cursor position.
 * @param {vscode.TextDocument} document
 * @param {vscode.Position} position
 * @returns {vscode.Diagnostic[]}
 */
function diagnosticsAtPosition(document, position) {
  const wordRange = document.getWordRangeAtPosition(position);
  return vscode.languages.getDiagnostics(document.uri).filter((d) => {
    if (d.range.contains(position)) {
      return true;
    }
    if (wordRange && d.range.intersection(wordRange)) {
      return true;
    }
    return false;
  });
}

/**
 * @param {vscode.TextDocument} document
 * @param {vscode.Position} position
 * @returns {{ diags: vscode.Diagnostic[], intentRange: vscode.Range } | undefined}
 */
function getIntentContext(document, position) {
  const diags = diagnosticsAtPosition(document, position);
  if (diags.length === 0) {
    return undefined;
  }

  const wordRange = document.getWordRangeAtPosition(position);
  let intentRange = wordRange || diags[0].range;
  for (const d of diags) {
    const hit = intentRange.intersection(d.range);
    if (hit) {
      intentRange = hit;
      break;
    }
  }

  return { diags, intentRange };
}

/**
 * @param {import("vscode").TextEditor} editor
 * @returns {import("vscode").Range}
 */
function rangeForAssist(editor) {
  const { document, selection } = editor;
  const word = document.getWordRangeAtPosition(selection.active);
  if (word) {
    return word;
  }
  return document.lineAt(selection.active.line).range;
}

/**
 * Range for Quick Edit: diagnostics at cursor, else word/line selection.
 * @param {import("vscode").TextEditor} editor
 * @param {vscode.Range | undefined} savedRange
 * @returns {vscode.Range}
 */
function rangeForQuickEdit(editor, savedRange) {
  const { document } = editor;

  if (savedRange) {
    return expandRangeToLines(document, savedRange);
  }

  const ctx = getIntentContext(document, editor.selection.active);
  if (ctx) {
    let merged = ctx.intentRange;
    for (const d of ctx.diags) {
      merged = merged.union(d.range);
    }
    return expandRangeToLines(document, merged);
  }

  return expandRangeToLines(document, rangeForAssist(editor));
}

/**
 * @param {import("vscode").TextDocument} document
 * @param {vscode.Range} range
 * @returns {vscode.Range}
 */
function expandRangeToLines(document, range) {
  const startLine = range.start.line;
  const endLine = range.end.line;
  return new vscode.Range(
    new vscode.Position(startLine, 0),
    document.lineAt(endLine).range.end
  );
}

/**
 * @param {import("vscode").TextEditor} editor
 * @param {vscode.Range} range
 * @returns {Promise<boolean>}
 */
async function openQuickEdit(editor, range) {
  const selection = new vscode.Selection(range.start, range.end);
  await vscode.window.showTextDocument(editor.document, {
    viewColumn: editor.viewColumn,
    preserveFocus: false,
    selection,
  });
  editor.revealRange(range, vscode.TextEditorRevealType.InCenterIfOutsideViewport);

  const cmd = await findAvailableCommand(QUICK_EDIT_COMMANDS);
  if (!cmd) {
    return false;
  }

  const argVariants = [
    { entry: "command" },
    { source: "pythonQuickIntent" },
    undefined,
  ];
  for (const args of argVariants) {
    try {
      if (args === undefined) {
        await vscode.commands.executeCommand(cmd);
      } else {
        await vscode.commands.executeCommand(cmd, args);
      }
      return true;
    } catch {
      // try next argument shape
    }
  }
  return false;
}

/**
 * @param {string} moduleName
 * @returns {Promise<vscode.Uri[]>}
 */
async function findModulePyFiles(moduleName) {
  return vscode.workspace.findFiles(
    `**/${moduleName}.py`,
    MODULE_FILE_EXCLUDES,
    15
  );
}

/**
 * @param {import("vscode").TextDocument} doc
 * @param {string} moduleName
 * @returns {boolean}
 */
function hasImportForModule(doc, moduleName) {
  const text = doc.getText();
  const re = new RegExp(
    `^\\s*(import\\s+${moduleName}\\b|from\\s+${moduleName}\\s+import\\s+)`,
    "m"
  );
  return re.test(text);
}

/**
 * @param {import("vscode").TextDocument} doc
 * @param {string} line
 * @returns {Promise<boolean>}
 */
async function insertImportLine(doc, line) {
  let insertAt = 0;
  for (let i = 0; i < doc.lineCount; i++) {
    const t = doc.lineAt(i).text.trim();
    if (t.startsWith("import ") || t.startsWith("from ")) {
      insertAt = i + 1;
    } else if (t && !t.startsWith("#") && insertAt > 0) {
      break;
    }
  }

  const edit = new vscode.WorkspaceEdit();
  edit.insert(doc.uri, new vscode.Position(insertAt, 0), line);
  return vscode.workspace.applyEdit(edit);
}

/**
 * @param {string} moduleName
 * @param {vscode.Uri[]} files
 * @returns {Promise<string | undefined>}
 */
async function pickImportLine(moduleName, files) {
  const options = [
    {
      label: `import ${moduleName}`,
      description: "entire module",
      line: `import ${moduleName}\n`,
    },
  ];

  if (files.length === 1) {
    const rel = vscode.workspace.asRelativePath(files[0]);
    options[0].description = rel;
    return options[0].line;
  }

  const picked = await vscode.window.showQuickPick(options, {
    title: `Python Quick Intent: import "${moduleName}"`,
    placeHolder: "Multiple modules found — choose one",
  });
  return picked?.line;
}

/**
 * @param {string} title
 * @param {string} commandId
 * @param {vscode.Range} range
 * @returns {vscode.CodeAction}
 */
function createIntentAction(title, commandId, range) {
  return {
    title,
    kind: QUICK_INTENT_KIND,
    command: {
      command: commandId,
      title,
    },
    range,
  };
}

/** In-editor menu when squiggles exist; otherwise delegate to Quick Fix. */
async function showIntentionsMenu() {
  const editor = getPythonEditor();
  if (!editor) {
    return;
  }

  const pos = editor.selection.active;
  const ctx = getIntentContext(editor.document, pos);
  if (!ctx) {
    await vscode.commands.executeCommand("editor.action.quickFix");
    return;
  }

  lastIntentRange = ctx.intentRange;

  await vscode.commands.executeCommand("editor.action.codeAction", {
    kind: QUICK_INTENT_KIND.value,
  });
}

async function addImport() {
  const editor = getPythonEditor();
  if (!editor) {
    return;
  }

  const { document } = editor;
  const range = lastIntentRange || rangeForAssist(editor);
  lastIntentRange = undefined;
  const name = document.getText(range).trim();
  if (!name || !/^[a-zA-Z_]\w*$/.test(name)) {
    await vscode.commands.executeCommand("editor.action.triggerSuggest");
    return;
  }

  editor.selection = new vscode.Selection(range.start, range.end);

  if (hasImportForModule(document, name)) {
    vscode.window.showInformationMessage(
      `Python Quick Intent: "${name}" is already imported.`
    );
    return;
  }

  const moduleFiles = await findModulePyFiles(name);
  if (moduleFiles.length > 0) {
    const importLine = await pickImportLine(name, moduleFiles);
    if (importLine) {
      const ok = await insertImportLine(document, importLine);
      if (ok) {
        vscode.window.setStatusBarMessage(
          `Python Quick Intent: ${importLine.trim()}`,
          4000
        );
        return;
      }
    }
  }

  const onlyImport = vscode.CodeActionKind.Source.append(
    "addMissingImports"
  );
  try {
    /** @type {import("vscode").CodeAction[] | undefined} */
    const actions = await vscode.commands.executeCommand(
      "vscode.executeCodeActionProvider",
      document.uri,
      range,
      onlyImport.value,
      50
    );
    const importAction = actions?.find((a) =>
      /import/i.test(a.title || "")
    );
    if (importAction?.edit) {
      await vscode.workspace.applyEdit(importAction.edit);
      return;
    }
  } catch {
    // ignore
  }

  await vscode.commands.executeCommand("editor.action.triggerSuggest");
}

/**
 * @param {import("vscode").TextEditor} editor
 * @param {vscode.Range} range
 */
function buildCodeSelectionPayload(editor, range) {
  const { document } = editor;
  const rawText = document.getText(range);
  const lang = document.languageId || "python";
  return {
    uri: document.uri,
    range: {
      selectionStartLineNumber: range.start.line + 1,
      selectionStartColumn: range.start.character + 1,
      positionLineNumber: range.end.line + 1,
      positionColumn: range.end.character + 1,
    },
    rawText,
    text: `\`\`\`${lang}\n${rawText}\n\`\`\``,
  };
}

/**
 * @param {import("vscode").TextEditor} editor
 * @param {vscode.Range} range
 * @returns {Promise<void>}
 */
async function focusEditorSelection(editor, range) {
  const selection = new vscode.Selection(range.start, range.end);
  await vscode.window.showTextDocument(editor.document, {
    viewColumn: editor.viewColumn,
    preserveFocus: false,
    selection,
  });
  editor.revealRange(range, vscode.TextEditorRevealType.InCenterIfOutsideViewport);
}

/**
 * @param {string} prompt
 * @returns {Promise<boolean>}
 */
async function insertPromptIntoComposer(prompt) {
  const focusCmd = await findAvailableCommand(AI_FOCUS_COMMANDS);
  if (focusCmd) {
    await vscode.commands.executeCommand(focusCmd);
  }

  const savedClipboard = await vscode.env.clipboard.readText().catch(() => "");
  await vscode.env.clipboard.writeText(prompt);

  try {
    for (const delayMs of [200, 450, 700]) {
      await sleep(delayMs);
      try {
        await vscode.commands.executeCommand(
          "editor.action.clipboardPasteAction"
        );
        return true;
      } catch {
        // composer input may not be ready
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
 * @param {import("vscode").TextEditor} editor
 * @param {vscode.Range} range
 * @returns {Promise<boolean>}
 */
async function openChatWithSelectionAndPrompt(prompt, editor, range) {
  const all = await vscode.commands.getCommands(true);
  const selection = buildCodeSelectionPayload(editor, range);

  if (all.includes(CHAT_WITH_SELECTION)) {
    try {
      await vscode.commands.executeCommand(CHAT_WITH_SELECTION, {
        codeSelections: [selection],
      });
      return insertPromptIntoComposer(prompt);
    } catch {
      // try next path
    }
  }

  if (all.includes(CHAT_NEW_AGENT_WITH_SELECTION)) {
    try {
      await vscode.commands.executeCommand(CHAT_NEW_AGENT_WITH_SELECTION);
      return insertPromptIntoComposer(prompt);
    } catch {
      // try next path
    }
  }

  return false;
}

/**
 * Opens Cursor Composer with the prompt pre-filled (native API).
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
        // fallback when paste target is not a text editor
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
 * @param {import("vscode").TextEditor} editor
 * @param {vscode.Range} range
 * @returns {Promise<void>}
 */
async function sendPromptToCursorAI(prompt, editor, range) {
  const intentRange = expandRangeToLines(editor.document, range);
  await focusEditorSelection(editor, intentRange);

  if (await openChatWithSelectionAndPrompt(prompt, editor, intentRange)) {
    return;
  }

  if (await openChatWithPrompt(prompt)) {
    return;
  }

  if (await openChatAndInsertPrompt(prompt)) {
    vscode.window.showInformationMessage(
      "Python Quick Intent: fix prompt inserted into AI chat."
    );
    return;
  }

  await vscode.env.clipboard.writeText(prompt);
  vscode.window.showWarningMessage(
    "Python Quick Intent: could not fill chat automatically. Prompt is in clipboard — open chat (Ctrl+L) and paste (Ctrl+V)."
  );
}

async function fixWithAI() {
  const editor = getPythonEditor();
  if (!editor) {
    return;
  }

  const range = rangeForQuickEdit(
    editor,
    lastIntentRange || rangeForAssist(editor)
  );
  lastIntentRange = undefined;

  const diags = vscode.languages.getDiagnostics(editor.document.uri);
  const atPos = diags
    .filter((d) => range.intersection(d.range))
    .map((d) => d.message)
    .join("\n");

  const prompt = [
    "Fix this Python snippet. Return only the corrected code with no explanation.",
    atPos ? `Analyzer messages:\n${atPos}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");

  await sendPromptToCursorAI(prompt, editor, range);
}

async function aiComplete() {
  const editor = getPythonEditor();
  if (!editor) {
    return;
  }

  const range = rangeForQuickEdit(editor, lastIntentRange);
  lastIntentRange = undefined;

  if (await openQuickEdit(editor, range)) {
    return;
  }

  vscode.window.showWarningMessage(
    "Python Quick Intent: Quick Edit unavailable. Use Ctrl+K in the editor."
  );
}

/** @param {import("vscode").ExtensionContext} context */
function activate(context) {
  const out = vscode.window.createOutputChannel("Python Quick Intent");
  out.appendLine(`activated ${new Date().toISOString()}`);
  context.subscriptions.push(out);

  const codeActionProvider = {
    /**
     * @param {vscode.TextDocument} document
     * @param {vscode.Range | vscode.Selection} range
     */
    provideCodeActions(document, range) {
      if (document.languageId !== "python") {
        return [];
      }

      const pos = range instanceof vscode.Selection ? range.active : range.start;
      const ctx = getIntentContext(document, pos);
      if (!ctx) {
        return [];
      }

      lastIntentRange = ctx.intentRange;

      return [
        createIntentAction(
          "Add import",
          "pythonQuickIntent.addImport",
          ctx.intentRange
        ),
        createIntentAction(
          "Fix with AI",
          "pythonQuickIntent.fixWithAI",
          ctx.intentRange
        ),
        createIntentAction(
          "Quick edit",
          "pythonQuickIntent.aiComplete",
          ctx.intentRange
        ),
      ];
    },
  };

  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider(
      { language: "python", scheme: "file" },
      codeActionProvider,
      { providedCodeActionKinds: [QUICK_INTENT_KIND] }
    ),
    vscode.commands.registerCommand(
      "pythonQuickIntent.showMenu",
      showIntentionsMenu
    ),
    vscode.commands.registerCommand("pythonQuickIntent.addImport", addImport),
    vscode.commands.registerCommand("pythonQuickIntent.fixWithAI", fixWithAI),
    vscode.commands.registerCommand("pythonQuickIntent.aiComplete", aiComplete)
  );
}

function deactivate() {}

module.exports = { activate, deactivate };
