const path = require("path");
const vscode = require("vscode");

/**
 * @typedef {Object} RefMatch
 * @property {"file"|"func"|"class"|"data"|"attr"|"mod"} kind
 * @property {string} value
 * @property {number} start
 * @property {number} end
 */

/** @type {Record<string, string[]>} */
const SYMBOL_SEARCH_ORDER = {
  func: ["func", "class", "data"],
  class: ["class", "func", "data"],
  data: ["data", "attr", "class"],
  attr: ["attr", "data", "class"],
};

function activate(context) {
  const selector = [{ language: "python", scheme: "file" }];
  const provider = new PyDocLinksDefinitionProvider();
  const registration = vscode.languages.registerDefinitionProvider(selector, provider);

  const infoCmd = vscode.commands.registerCommand("pyDocLinks.showSupportedFormats", async () => {
    await vscode.window.showInformationMessage(
      "Py Doc Links: filename.py, :py:func:/:py:class:/:py:data:/:py:mod: (and :func:/:class:/:data: short forms)"
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

  if (ref.kind === "func" || ref.kind === "class" || ref.kind === "data" || ref.kind === "attr") {
    return resolveSymbolReference(sourceDocument, ref);
  }

  return undefined;
}

/**
 * @param {vscode.TextDocument} sourceDocument
 * @param {RefMatch} ref
 * @returns {Promise<vscode.Location | undefined>}
 */
async function resolveSymbolReference(sourceDocument, ref) {
  const parsed = parseQualifiedSymbolRef(ref.value);
  if (!parsed) return undefined;

  const { fileName, symbolName, currentFile } = parsed;
  const targetUri = currentFile
    ? sourceDocument.uri
    : await resolveFileInWorkspace(sourceDocument, fileName);
  if (!targetUri) return undefined;

  const targetDoc = targetUri.fsPath === sourceDocument.uri.fsPath
    ? sourceDocument
    : await vscode.workspace.openTextDocument(targetUri);

  const kinds = SYMBOL_SEARCH_ORDER[ref.kind] ?? SYMBOL_SEARCH_ORDER.func;
  const symbolLoc = findSymbolLocation(targetDoc, symbolName, kinds);
  if (symbolLoc) {
    return new vscode.Location(targetUri, symbolLoc);
  }

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
  collectGroupMatches(line, /:py:class:`([\w]+(?:\.[\w]+)*)`/g, (value, start, end) => {
    add("class", value, start, end);
  });
  collectGroupMatches(line, /:class:`([\w]+(?:\.[\w]+)*)`/g, (value, start, end) => {
    add("class", value, start, end);
  });
  collectGroupMatches(line, /:py:data:`([\w]+(?:\.[\w]+)*)`/g, (value, start, end) => {
    add("data", value, start, end);
  });
  collectGroupMatches(line, /:data:`([\w]+(?:\.[\w]+)*)`/g, (value, start, end) => {
    add("data", value, start, end);
  });
  collectGroupMatches(line, /:py:attr:`([\w]+(?:\.[\w]+)*)`/g, (value, start, end) => {
    add("attr", value, start, end);
  });
  collectGroupMatches(line, /:attr:`([\w]+(?:\.[\w]+)*)`/g, (value, start, end) => {
    add("attr", value, start, end);
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
 * @returns {{fileName: string, symbolName: string, currentFile: boolean} | undefined}
 */
function parseQualifiedSymbolRef(raw) {
  const parts = raw.split(".").filter(Boolean);
  if (parts.length === 0) return undefined;

  const symbolName = parts[parts.length - 1];
  if (!symbolName) return undefined;

  if (parts.length === 1) {
    return { fileName: "", symbolName, currentFile: true };
  }

  let moduleName;
  if (parts.length >= 3 && parts[parts.length - 2].toLowerCase() === "py") {
    moduleName = parts[parts.length - 3];
  } else {
    moduleName = parts[parts.length - 2];
  }
  if (!moduleName) return undefined;

  return { fileName: `${moduleName}.py`, symbolName, currentFile: false };
}

/**
 * @param {vscode.TextDocument} doc
 * @param {string} symbolName
 * @param {string[]} kinds
 * @returns {vscode.Position | undefined}
 */
function findSymbolLocation(doc, symbolName, kinds) {
  const escaped = escapeRegExp(symbolName);
  /** @type {Record<string, RegExp>} */
  const patterns = {
    func: new RegExp(`^\\s*(?:async\\s+)?def\\s+${escaped}\\s*\\(`),
    class: new RegExp(`^\\s*class\\s+${escaped}\\s*[\\(:]`),
    data: new RegExp(`^\\s*${escaped}\\s*(?::[^=]+)?\\s*=`),
    attr: new RegExp(`^\\s*${escaped}\\s*(?::[^=]+)?\\s*=`),
  };

  for (const kind of kinds) {
    const re = patterns[kind];
    if (!re) continue;
    for (let i = 0; i < doc.lineCount; i += 1) {
      const line = doc.lineAt(i).text;
      if (re.test(line)) {
        const col = Math.max(0, line.indexOf(symbolName));
        return new vscode.Position(i, col);
      }
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
  const sourceDir = path.dirname(sourceDocument.uri.fsPath);
  const siblingUri = vscode.Uri.file(path.join(sourceDir, fileName));
  try {
    const stat = await vscode.workspace.fs.stat(siblingUri);
    if (stat.type === vscode.FileType.File) {
      return siblingUri;
    }
  } catch {
    // sibling not present — search workspace
  }

  const workspaceFolder = vscode.workspace.getWorkspaceFolder(sourceDocument.uri);
  const include = workspaceFolder
    ? new vscode.RelativePattern(workspaceFolder, `**/${fileName}`)
    : `**/${fileName}`;
  const exclude = "**/{.git,node_modules,dist,build,out,.venv,venv,__pycache__}/**";
  const found = await vscode.workspace.findFiles(include, exclude, 50);
  if (found.length === 0) return undefined;

  return pickBestFileCandidate(sourceDocument, found);
}

/**
 * When several files share a basename (e.g. many main.py), prefer the copy next
 * to the source file and de-prioritize docs/examples trees.
 *
 * @param {vscode.TextDocument} sourceDocument
 * @param {vscode.Uri[]} candidates
 * @returns {vscode.Uri}
 */
function pickBestFileCandidate(sourceDocument, candidates) {
  const sourceDir = path.dirname(sourceDocument.uri.fsPath);
  let best = candidates[0];
  let bestScore = Number.NEGATIVE_INFINITY;

  for (const uri of candidates) {
    const score = scoreFileCandidate(sourceDir, uri.fsPath);
    if (score > bestScore) {
      bestScore = score;
      best = uri;
    }
  }
  return best;
}

/** @type {string[]} */
const DEPRIORITIZED_PATH_SEGMENTS = [
  "/docs/",
  "\\docs\\",
  "/!to_tg/",
  "\\!to_tg\\",
  "/examples/",
  "\\examples\\",
];

/**
 * @param {string} sourceDir
 * @param {string} candidatePath
 * @returns {number}
 */
function scoreFileCandidate(sourceDir, candidatePath) {
  const anchorDir = normalizePath(sourceDir);
  const candidate = normalizePath(candidatePath);
  const candidateDir = normalizePath(path.dirname(candidatePath));

  let score = 0;

  if (candidateDir === anchorDir) {
    score += 10_000;
  }

  if (candidate.startsWith(`${anchorDir}/`)) {
    score += 1_000;
  }

  for (const segment of DEPRIORITIZED_PATH_SEGMENTS) {
    if (candidate.includes(normalizePath(segment))) {
      score -= 2_000;
    }
  }

  score += commonPrefixLength(anchorDir, candidateDir);

  const relDir = path.relative(sourceDir, path.dirname(candidatePath));
  const hops = relDir.split(/[/\\]/).filter((part) => part && part !== "." && part !== "..").length;
  score -= hops * 50;

  return score;
}

/**
 * @param {string} value
 * @returns {string}
 */
function normalizePath(value) {
  return value.replace(/\\/g, "/").toLowerCase();
}

/**
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
function commonPrefixLength(a, b) {
  const normA = normalizePath(a);
  const normB = normalizePath(b);
  const limit = Math.min(normA.length, normB.length);
  let i = 0;
  while (i < limit && normA[i] === normB[i]) {
    i += 1;
  }
  return i;
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
