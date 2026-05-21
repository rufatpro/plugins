const path = require("path");
const vscode = require("vscode");

/**
 * @typedef {Object} RefMatch
 * @property {"file"|"func"|"mod"} kind
 * @property {string} value
 * @property {number} start
 * @property {number} end
 */

function activate(context) {
  const selector = [{ language: "python", scheme: "file" }];
  const provider = new PyDocLinksDefinitionProvider();
  const registration = vscode.languages.registerDefinitionProvider(selector, provider);

  const infoCmd = vscode.commands.registerCommand("pyDocLinks.showSupportedFormats", async () => {
    await vscode.window.showInformationMessage(
      "Py Doc Links formats: filename.py, :py:func:`module.func`, :func:`module.func`, :func:`func`, :py:mod:`module`"
    );
  });

  context.subscriptions.push(registration, infoCmd);
}

class PyDocLinksDefinitionProvider {
  /**
   * @param {vscode.TextDocument} document
   * @param {vscode.Position} position
   * @returns {Promise<vscode.Definition | undefined>}
   */
  async provideDefinition(document, position) {
    const lineText = document.lineAt(position.line).text;
    const refs = parseReferences(lineText);
    const ref = refs.find((r) => position.character >= r.start && position.character <= r.end);
    if (!ref) return undefined;

    return resolveReference(document, ref);
  }
}

/**
 * @param {vscode.TextDocument} sourceDocument
 * @param {RefMatch} ref
 * @returns {Promise<vscode.Location | undefined>}
 */
async function resolveReference(sourceDocument, ref) {
  if (ref.kind === "file") {
    const targetFile = await resolveFileInWorkspace(sourceDocument, ref.value);
    if (!targetFile) return undefined;
    return new vscode.Location(targetFile, new vscode.Position(0, 0));
  }

  if (ref.kind === "mod") {
    const fileName = ref.value.toLowerCase().endsWith(".py")
      ? ref.value
      : `${lastSegment(ref.value)}.py`;
    const targetFile = await resolveFileInWorkspace(sourceDocument, fileName);
    if (!targetFile) return undefined;
    return new vscode.Location(targetFile, new vscode.Position(0, 0));
  }

  // kind === "func"
  const parsed = parseFunctionRef(ref.value);
  if (!parsed) return undefined;

  const { fileName, funcName, currentFile } = parsed;
  const targetUri = currentFile
    ? sourceDocument.uri
    : await resolveFileInWorkspace(sourceDocument, fileName);
  if (!targetUri) return undefined;

  const targetDoc = targetUri.fsPath === sourceDocument.uri.fsPath
    ? sourceDocument
    : await vscode.workspace.openTextDocument(targetUri);

  const funcLoc = findFunctionLocation(targetDoc, funcName);
  if (funcLoc) {
    return new vscode.Location(targetUri, funcLoc);
  }

  // Fallback: open file even if function wasn't found
  return new vscode.Location(targetUri, new vscode.Position(0, 0));
}

/**
 * @param {string} line
 * @returns {RefMatch[]}
 */
function parseReferences(line) {
  /** @type {RefMatch[]} */
  const refs = [];

  const add = (kind, value, start, end) => {
    if (!value) return;
    if (refs.some((r) => intersects(r.start, r.end, start, end))) return;
    refs.push({ kind, value, start, end });
  };

  // Priority: Sphinx references first, then filename.py matches.
  collectGroupMatches(line, /:py:func:`([\w]+(?:\.[\w]+)*)`/g, (value, start, end) => {
    add("func", value, start, end);
  });
  collectGroupMatches(line, /:func:`([\w]+(?:\.[\w]+)*)`/g, (value, start, end) => {
    add("func", value, start, end);
  });
  collectGroupMatches(line, /:py:mod:`([\w]+(?:\.[\w]+)*)`/g, (value, start, end) => {
    add("mod", value, start, end);
  });
  collectGroupMatches(line, /(?<!\w)([\w-]+\.py)(?!\w)/g, (value, start, end) => {
    add("file", value, start, end);
  });

  return refs.sort((a, b) => a.start - b.start);
}

/**
 * @param {string} line
 * @param {RegExp} regex
 * @param {(value: string, start: number, end: number) => void} onMatch
 */
function collectGroupMatches(line, regex, onMatch) {
  for (const m of line.matchAll(regex)) {
    const whole = m[0] ?? "";
    const value = m[1] ?? "";
    const matchStart = m.index ?? -1;
    if (matchStart < 0 || !value) continue;

    const offsetInWhole = whole.indexOf(value);
    if (offsetInWhole < 0) continue;
    const start = matchStart + offsetInWhole;
    const end = start + value.length;
    onMatch(value, start, end);
  }
}

/**
 * @param {string} raw
 * @returns {{fileName: string, funcName: string, currentFile: boolean} | undefined}
 */
function parseFunctionRef(raw) {
  const parts = raw.split(".").filter(Boolean);
  if (parts.length === 0) return undefined;

  const funcName = parts[parts.length - 1];
  if (!funcName) return undefined;

  // :func:`run_main_flow` -> current file
  if (parts.length === 1) {
    return { fileName: "", funcName, currentFile: true };
  }

  // Tolerant filename form: module.py.func
  let moduleName;
  if (parts.length >= 3 && parts[parts.length - 2].toLowerCase() === "py") {
    moduleName = parts[parts.length - 3];
  } else {
    moduleName = parts[parts.length - 2];
  }
  if (!moduleName) return undefined;

  return { fileName: `${moduleName}.py`, funcName, currentFile: false };
}

/**
 * @param {vscode.TextDocument} doc
 * @param {string} funcName
 * @returns {vscode.Position | undefined}
 */
function findFunctionLocation(doc, funcName) {
  const escaped = escapeRegExp(funcName);
  const re = new RegExp(`^\\s*(?:async\\s+def|def)\\s+${escaped}\\s*\\(`);
  for (let i = 0; i < doc.lineCount; i += 1) {
    const line = doc.lineAt(i).text;
    if (re.test(line)) {
      const col = Math.max(0, line.indexOf(funcName));
      return new vscode.Position(i, col);
    }
  }
  return undefined;
}

/**
 * @param {vscode.TextDocument} sourceDocument
 * @param {string} fileName
 * @returns {Promise<vscode.Uri | undefined>}
 */
async function resolveFileInWorkspace(sourceDocument, fileName) {
  const workspaceFolder = vscode.workspace.getWorkspaceFolder(sourceDocument.uri);
  const include = workspaceFolder
    ? new vscode.RelativePattern(workspaceFolder, `**/${fileName}`)
    : `**/${fileName}`;
  const exclude = "**/{.git,node_modules,dist,build,out,.venv,venv,__pycache__}/**";
  const found = await vscode.workspace.findFiles(include, exclude, 50);
  if (found.length === 0) return undefined;

  // Prefer exact basename match first.
  const exact = found.find((u) => path.basename(u.fsPath) === fileName);
  return exact ?? found[0];
}

function lastSegment(value) {
  const parts = value.split(".").filter(Boolean);
  return parts[parts.length - 1] ?? value;
}

function intersects(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
