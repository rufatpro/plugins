const path = require("path");
const vscode = require("vscode");

/**
 * @typedef {Object} RefMatch
 * @property {"file"|"symbol"} kind
 * @property {string} value
 * @property {number} start
 * @property {number} end
 */

const TS_FILE_EXT =
  "(?:tsx?|jsx?|mtsx?|cts|cjs|mjs)";
const TS_FILE_EXT_RE = new RegExp(`\\.${TS_FILE_EXT}$`, "i");

/** @type {Map<string, { mtime: number, paths: Record<string, string[]>, baseUrl: string }>} */
const tsconfigCache = new Map();

/** @type {string[]} */
const DEPRIORITIZED_PATH_SEGMENTS = [
  "/docs/",
  "\\docs\\",
  "/!to_tg/",
  "\\!to_tg\\",
  "/examples/",
  "\\examples\\",
  "/dist/",
  "\\dist\\",
  "/.next/",
  "\\.next\\",
  "/coverage/",
  "\\coverage\\",
  "/node_modules/",
  "\\node_modules\\",
];

/** @type {string[]} */
const SYMBOL_KIND_ORDER = ["function", "class", "interface", "type", "enum", "const"];

function activate(context) {
  const selector = [
    { language: "typescript", scheme: "file" },
    { language: "javascript", scheme: "file" },
    { language: "typescriptreact", scheme: "file" },
    { language: "javascriptreact", scheme: "file" },
  ];
  const provider = new TsDocLinksDefinitionProvider();
  const registration = vscode.languages.registerDefinitionProvider(selector, provider);

  const infoCmd = vscode.commands.registerCommand("tsDocLinks.showSupportedFormats", async () => {
    await vscode.window.showInformationMessage(
      "TypeScript Doc Links: @see, {@link ./file.ts}, File:, // See, module.export, {@link Class#member}, {@link Class.method}"
    );
  });

  context.subscriptions.push(registration, infoCmd);
}

class TsDocLinksDefinitionProvider {
  /**
   * @param {vscode.TextDocument} document
   * @param {vscode.Position} position
   * @returns {Promise<vscode.Definition | undefined>}
   */
  async provideDefinition(document, position) {
    const lineText = document.lineAt(position.line).text;
    if (!isLikelyCommentLine(lineText)) return undefined;

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
    const resolved = await resolveFileReference(sourceDocument, ref.value);
    return resolved;
  }

  if (ref.kind === "symbol") {
    return resolveSymbolReference(sourceDocument, ref.value);
  }

  return undefined;
}

/**
 * @param {vscode.TextDocument} sourceDocument
 * @param {string} raw
 * @returns {Promise<vscode.Location | undefined>}
 */
async function resolveFileReference(sourceDocument, raw) {
  const { pathPart, line } = parseLineColumn(raw.trim());
  if (!pathPart) return undefined;

  const targetUri = await resolveFilePath(sourceDocument, pathPart);
  if (!targetUri) return undefined;

  const position =
    line !== undefined
      ? new vscode.Position(Math.max(0, line - 1), 0)
      : new vscode.Position(0, 0);

  return new vscode.Location(targetUri, position);
}

/**
 * @param {vscode.TextDocument} sourceDocument
 * @param {string} raw
 * @returns {Promise<vscode.Location | undefined>}
 */
async function resolveSymbolReference(sourceDocument, raw) {
  const parsed = parseQualifiedSymbolRef(raw.trim());
  if (!parsed) return undefined;

  if (parsed.kind === "classMember") {
    return resolveClassMemberReference(sourceDocument, parsed.className, parsed.memberName);
  }

  const { fileHint, symbolName, currentFile } = parsed;
  const targetUri = currentFile
    ? sourceDocument.uri
    : await resolveFilePath(sourceDocument, fileHint);
  if (!targetUri) return undefined;

  const targetDoc =
    targetUri.fsPath === sourceDocument.uri.fsPath
      ? sourceDocument
      : await vscode.workspace.openTextDocument(targetUri);

  const symbolLoc = findSymbolLocation(targetDoc, symbolName) ?? findMethodInFile(targetDoc, symbolName);
  if (symbolLoc) {
    return new vscode.Location(targetUri, symbolLoc);
  }

  return new vscode.Location(targetUri, new vscode.Position(0, 0));
}

/**
 * @param {vscode.TextDocument} sourceDocument
 * @param {string} className
 * @param {string} memberName
 * @returns {Promise<vscode.Location | undefined>}
 */
async function resolveClassMemberReference(sourceDocument, className, memberName) {
  const targetUri = await findClassDefinitionFile(sourceDocument, className);
  if (!targetUri) return undefined;

  const targetDoc =
    targetUri.fsPath === sourceDocument.uri.fsPath
      ? sourceDocument
      : await vscode.workspace.openTextDocument(targetUri);

  const memberLoc = findClassMemberLocation(targetDoc, className, memberName);
  if (memberLoc) {
    return new vscode.Location(targetUri, memberLoc);
  }

  const classLoc = findSymbolLocation(targetDoc, className);
  if (classLoc) {
    return new vscode.Location(targetUri, classLoc);
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
    const trimmed = value.trim();
    if (!trimmed) return;
    if (refs.some((r) => intersects(r.start, r.end, start, end))) return;
    refs.push({ kind, value: trimmed, start, end });
  };

  collectGroupMatches(line, /\{@link(?:code|plain|linkplain)?\s+([^}]+)\}/gi, (value, start, end) => {
    addJsDocLinkRef(value, start, end, add);
  });

  collectGroupMatches(line, /@see\s+([^\s*]+)/gi, (value, start, end) => {
    const trimmed = value.trim();
    if (/^https?:\/\//i.test(trimmed)) return;
    addPathOrSymbolRef(trimmed, start, end, add);
  });

  collectGroupMatches(line, /File:\s*([^\s*]+)/gi, (value, start, end) => {
    add("file", value, start, end);
  });

  collectGroupMatches(line, /\/\/\s*See\s+([^\s*]+)/gi, (value, start, end) => {
    add("file", value, start, end);
  });

  collectGroupMatches(line, /`([^`]+\.(?:tsx?|jsx?|mtsx?|cts|cjs|mjs)(?::\d+|#L?\d+)?)`/gi, (value, start, end) => {
    add("file", value, start, end);
  });

  collectGroupMatches(
    line,
    new RegExp(`(?<![\\w./@-])([\\w./@-]+\\.${TS_FILE_EXT})(?::\\d+|#L?\\d+)?(?![\\w])`, "gi"),
    (value, start, end) => {
      add("file", value, start, end);
    }
  );

  return refs.sort((a, b) => a.start - b.start);
}

/**
 * @param {string} content
 * @param {number} start
 * @param {number} end
 * @param {(kind: "file"|"symbol", value: string, start: number, end: number) => void} add
 */
function addJsDocLinkRef(content, start, end, add) {
  const trimmed = content.trim();
  if (!trimmed || /^https?:\/\//i.test(trimmed)) return;
  addPathOrSymbolRef(trimmed, start, end, add);
}

/**
 * @param {string} content
 * @param {number} start
 * @param {number} end
 * @param {(kind: "file"|"symbol", value: string, start: number, end: number) => void} add
 */
function addPathOrSymbolRef(content, start, end, add) {
  const { pathPart } = parseLineColumn(content);
  const target = pathPart ?? content;
  if (looksLikeFilePath(target)) {
    add("file", content, start, end);
    return;
  }
  if (/^[\w$#]+$/.test(target) || /^[\w$#.]+$/.test(target)) {
    add("symbol", content, start, end);
  }
}

/**
 * @param {string} value
 * @returns {boolean}
 */
function looksLikeFilePath(value) {
  if (/^\.{0,2}\//.test(value)) return true;
  if (/^@\//.test(value)) return true;
  if (/^file:\/\//i.test(value)) return true;
  if (TS_FILE_EXT_RE.test(value)) return true;
  if (/[/\\]/.test(value) && /\.[\w]+$/.test(value)) return true;
  return false;
}

/**
 * @param {string} line
 * @returns {boolean}
 */
function isLikelyCommentLine(line) {
  const trimmed = line.trim();
  if (trimmed.startsWith("//")) return true;
  if (trimmed.startsWith("*") || trimmed.startsWith("/**")) return true;
  if (/\{@link/i.test(line)) return true;
  if (/@see\b/i.test(line)) return true;
  if (/File:\s*\S+/i.test(line)) return true;
  return false;
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
 * @returns {{ pathPart: string, line: number | undefined }}
 */
function parseLineColumn(raw) {
  let pathPart = raw.trim();
  let line;

  const hashMatch = pathPart.match(/#L?(\d+)$/i);
  if (hashMatch) {
    line = Number.parseInt(hashMatch[1], 10);
    pathPart = pathPart.slice(0, hashMatch.index).trim();
  }

  const colonMatch = pathPart.match(/:(\d+)$/);
  if (colonMatch && TS_FILE_EXT_RE.test(pathPart.slice(0, colonMatch.index))) {
    line = Number.parseInt(colonMatch[1], 10);
    pathPart = pathPart.slice(0, colonMatch.index).trim();
  }

  return { pathPart, line: Number.isFinite(line) ? line : undefined };
}

/**
 * @param {string} raw
 * @returns
 *   | { kind: "classMember", className: string, memberName: string }
 *   | { kind: "module", fileHint: string, symbolName: string, currentFile: boolean }
 *   | undefined
 */
function parseQualifiedSymbolRef(raw) {
  const hashIdx = raw.indexOf("#");
  if (hashIdx > 0) {
    const className = raw.slice(0, hashIdx).trim();
    const memberName = raw.slice(hashIdx + 1).trim();
    if (
      className &&
      memberName &&
      /^[A-Z][\w$]*$/.test(className) &&
      /^[\w$]+$/.test(memberName) &&
      !/^\d+$/.test(memberName)
    ) {
      return { kind: "classMember", className, memberName };
    }
  }

  const parts = raw.split(".").filter(Boolean);
  if (parts.length === 0) return undefined;

  const symbolName = parts[parts.length - 1];
  if (!symbolName || !/^[\w$]+$/.test(symbolName)) return undefined;

  if (parts.length === 2 && /^[A-Z][\w$]*$/.test(parts[0])) {
    return { kind: "classMember", className: parts[0], memberName: symbolName };
  }

  if (parts.length === 1) {
    return { kind: "module", fileHint: "", symbolName, currentFile: true };
  }

  const penultimate = parts[parts.length - 2];
  if (penultimate && TS_FILE_EXT_RE.test(`.${penultimate}`)) {
    const ext = penultimate.toLowerCase();
    const base = parts[parts.length - 3];
    if (!base) return undefined;
    return { kind: "module", fileHint: `${base}.${ext}`, symbolName, currentFile: false };
  }

  const moduleName = penultimate;
  if (!moduleName) return undefined;

  if (TS_FILE_EXT_RE.test(moduleName)) {
    return { kind: "module", fileHint: moduleName, symbolName, currentFile: false };
  }

  return { kind: "module", fileHint: `${moduleName}.ts`, symbolName, currentFile: false };
}

/**
 * @param {vscode.TextDocument} sourceDocument
 * @param {string} className
 * @returns {Promise<vscode.Uri | undefined>}
 */
async function findClassDefinitionFile(sourceDocument, className) {
  const fromImport = await findImportedSymbolFile(sourceDocument, className);
  if (fromImport) return fromImport;

  const workspaceFolder = vscode.workspace.getWorkspaceFolder(sourceDocument.uri);
  const include = workspaceFolder
    ? new vscode.RelativePattern(workspaceFolder, `**/*.{ts,tsx,js,jsx}`)
    : `**/*.{ts,tsx,js,jsx}`;
  const exclude = "**/{node_modules,dist,build,.git,.next,coverage}/**";
  const files = await vscode.workspace.findFiles(include, exclude, 80);

  const escaped = escapeRegExp(className);
  const classDeclRe = new RegExp(`\\b(?:export\\s+)?(?:abstract\\s+)?class\\s+${escaped}\\b`);

  let bestUri;
  let bestScore = Number.NEGATIVE_INFINITY;
  const sourceDir = path.dirname(sourceDocument.uri.fsPath);

  for (const uri of files) {
    const doc =
      uri.fsPath === sourceDocument.uri.fsPath
        ? sourceDocument
        : await vscode.workspace.openTextDocument(uri);
    let found = false;
    for (let i = 0; i < doc.lineCount; i += 1) {
      if (classDeclRe.test(doc.lineAt(i).text)) {
        found = true;
        break;
      }
    }
    if (!found) continue;

    const score = scoreFileCandidate(sourceDir, uri.fsPath);
    if (score > bestScore) {
      bestScore = score;
      bestUri = uri;
    }
  }

  return bestUri;
}

/**
 * @param {vscode.TextDocument} sourceDocument
 * @param {string} symbolName
 * @returns {Promise<vscode.Uri | undefined>}
 */
async function findImportedSymbolFile(sourceDocument, symbolName) {
  const escaped = escapeRegExp(symbolName);
  const importRes = [
    new RegExp(`import\\s+\\{[^}]*\\b${escaped}\\b[^}]*\\}\\s+from\\s+['"]([^'"]+)['"]`),
    new RegExp(`import\\s+type\\s+\\{[^}]*\\b${escaped}\\b[^}]*\\}\\s+from\\s+['"]([^'"]+)['"]`),
    new RegExp(`import\\s+\\b${escaped}\\b\\s+from\\s+['"]([^'"]+)['"]`),
  ];

  for (let i = 0; i < sourceDocument.lineCount; i += 1) {
    const line = sourceDocument.lineAt(i).text;
    for (const re of importRes) {
      const m = line.match(re);
      if (m?.[1]) {
        return resolveImportSpecifier(sourceDocument, m[1]);
      }
    }
  }

  return undefined;
}

/**
 * @param {vscode.TextDocument} sourceDocument
 * @param {string} importPath
 * @returns {Promise<vscode.Uri | undefined>}
 */
async function resolveImportSpecifier(sourceDocument, importPath) {
  const sourceDir = path.dirname(sourceDocument.uri.fsPath);
  const joined = path.join(sourceDir, importPath);
  return tryResolveExistingFile(vscode.Uri.file(joined));
}

/**
 * @param {vscode.TextDocument} doc
 * @param {string} className
 * @param {string} memberName
 * @returns {vscode.Position | undefined}
 */
function findClassMemberLocation(doc, className, memberName) {
  const escapedClass = escapeRegExp(className);
  const escapedMember = escapeRegExp(memberName);
  const classDeclRe = new RegExp(`\\bclass\\s+${escapedClass}\\b`);

  let classStart = -1;
  for (let i = 0; i < doc.lineCount; i += 1) {
    if (classDeclRe.test(doc.lineAt(i).text)) {
      classStart = i;
      break;
    }
  }
  if (classStart < 0) return undefined;

  const memberRe = new RegExp(
    `^\\s+(?:(?:public|private|protected|readonly|static|async|get|set)\\s+)*${escapedMember}\\s*[(=:<]`
  );

  let braceDepth = 0;
  let started = false;

  for (let i = classStart; i < doc.lineCount; i += 1) {
    const line = doc.lineAt(i).text;
    if (i > classStart && /^\s*(?:export\s+)?(?:abstract\s+)?class\s+\w/.test(line)) {
      break;
    }

    for (const ch of line) {
      if (ch === "{") {
        braceDepth += 1;
        started = true;
      } else if (ch === "}") {
        braceDepth -= 1;
        if (started && braceDepth <= 0 && i > classStart) {
          return undefined;
        }
      }
    }

    if (i > classStart && memberRe.test(line)) {
      const col = Math.max(0, line.indexOf(memberName));
      return new vscode.Position(i, col);
    }
  }

  return undefined;
}

/**
 * @param {vscode.TextDocument} sourceDocument
 * @param {string} rawPath
 * @returns {Promise<vscode.Uri | undefined>}
 */
async function resolveFilePath(sourceDocument, rawPath) {
  let pathPart = rawPath.replace(/\\/g, "/").trim();
  if (!pathPart) return undefined;

  if (/^file:\/\//i.test(pathPart)) {
    try {
      return vscode.Uri.parse(pathPart);
    } catch {
      return undefined;
    }
  }

  if (pathPart.startsWith("@/")) {
    const aliasResolved = await resolvePathAlias(sourceDocument, pathPart);
    if (aliasResolved) return aliasResolved;
  }

  const sourceDir = path.dirname(sourceDocument.uri.fsPath);

  if (pathPart.startsWith("./") || pathPart.startsWith("../")) {
    const relativeUri = vscode.Uri.file(path.join(sourceDir, pathPart));
    const found = await tryResolveExistingFile(relativeUri);
    if (found) return found;
  }

  if (path.isAbsolute(pathPart)) {
    const absUri = vscode.Uri.file(pathPart);
    const found = await tryResolveExistingFile(absUri);
    if (found) return found;
  }

  const siblingUri = vscode.Uri.file(path.join(sourceDir, path.basename(pathPart)));
  const siblingFound = await tryResolveExistingFile(siblingUri);
  if (siblingFound) return siblingFound;

  const withExtensions = await tryResolveWithExtensions(sourceDir, pathPart);
  if (withExtensions) return withExtensions;

  return resolveFileInWorkspace(sourceDocument, path.basename(pathPart));
}

/**
 * @param {vscode.Uri} uri
 * @returns {Promise<vscode.Uri | undefined>}
 */
async function tryResolveExistingFile(uri) {
  try {
    const stat = await vscode.workspace.fs.stat(uri);
    if (stat.type === vscode.FileType.File) return uri;
  } catch {
    // not found
  }

  const ext = path.extname(uri.fsPath);
  if (ext) return undefined;

  for (const suffix of [".ts", ".tsx", ".js", ".jsx", "/index.ts", "/index.tsx"]) {
    const candidate = vscode.Uri.file(`${uri.fsPath}${suffix}`);
    try {
      const stat = await vscode.workspace.fs.stat(candidate);
      if (stat.type === vscode.FileType.File) return candidate;
    } catch {
      // continue
    }
  }

  return undefined;
}

/**
 * @param {string} dir
 * @param {string} pathPart
 * @returns {Promise<vscode.Uri | undefined>}
 */
async function tryResolveWithExtensions(dir, pathPart) {
  const base = path.join(dir, pathPart);
  const direct = await tryResolveExistingFile(vscode.Uri.file(base));
  if (direct) return direct;

  if (!TS_FILE_EXT_RE.test(pathPart)) {
    for (const ext of [".ts", ".tsx", ".js", ".jsx"]) {
      const candidate = await tryResolveExistingFile(vscode.Uri.file(`${base}${ext}`));
      if (candidate) return candidate;
    }
  }

  return undefined;
}

/**
 * @param {vscode.TextDocument} sourceDocument
 * @param {string} importPath
 * @returns {Promise<vscode.Uri | undefined>}
 */
async function resolvePathAlias(sourceDocument, importPath) {
  const config = await loadNearestTsconfig(sourceDocument.uri);
  if (!config) return undefined;

  const configRoot = path.dirname(config.tsconfigPath);

  for (const [pattern, targets] of Object.entries(config.paths)) {
    const mapped = mapTsconfigPath(importPath, pattern, targets, config.baseUrl);
    if (!mapped) continue;

    const fromConfigRoot = path.join(configRoot, mapped.replace(/\//g, path.sep));
    const fromRootFound = await tryResolveExistingFile(vscode.Uri.file(fromConfigRoot));
    if (fromRootFound) return fromRootFound;

    const resolved = await tryResolveWithExtensions(
      path.dirname(sourceDocument.uri.fsPath),
      mapped
    );
    if (resolved) return resolved;
  }

  return undefined;
}

/**
 * @param {string} importPath
 * @param {string} pattern
 * @param {string[]} targets
 * @param {string} baseUrl
 * @param {vscode.Uri} sourceUri
 * @returns {string | undefined}
 */
function mapTsconfigPath(importPath, pattern, targets, baseUrl) {
  const starIndex = pattern.indexOf("*");
  if (starIndex < 0) {
    if (importPath !== pattern) return undefined;
    return targets[0];
  }

  const prefix = pattern.slice(0, starIndex);
  const suffix = pattern.slice(starIndex + 1);
  if (!importPath.startsWith(prefix) || !importPath.endsWith(suffix)) return undefined;

  const matched = importPath.slice(prefix.length, importPath.length - suffix.length);
  const target = targets[0];
  if (!target) return undefined;

  const physical = target.replace("*", matched);
  if (baseUrl && baseUrl !== ".") {
    return path.join(baseUrl, physical).replace(/\\/g, "/");
  }
  return physical.replace(/\\/g, "/");
}

/**
 * @param {vscode.Uri} sourceUri
 * @returns {Promise<{ paths: Record<string, string[]>, baseUrl: string, tsconfigPath: string } | undefined>}
 */
async function loadNearestTsconfig(sourceUri) {
  let dir = path.dirname(sourceUri.fsPath);
  const workspaceFolder = vscode.workspace.getWorkspaceFolder(sourceUri);
  const root = workspaceFolder?.uri.fsPath;

  while (true) {
    const tsconfigPath = path.join(dir, "tsconfig.json");
    const cacheKey = tsconfigPath;

    try {
      const stat = await vscode.workspace.fs.stat(vscode.Uri.file(tsconfigPath));
      const cached = tsconfigCache.get(cacheKey);
      if (cached && cached.mtime === stat.mtime) {
        return { paths: cached.paths, baseUrl: cached.baseUrl, tsconfigPath };
      }

      const raw = Buffer.from(await vscode.workspace.fs.readFile(vscode.Uri.file(tsconfigPath))).toString(
        "utf8"
      );
      const json = stripJsonComments(raw);
      const parsed = JSON.parse(json);
      const compilerOptions = parsed.compilerOptions ?? {};
      const paths = compilerOptions.paths ?? {};
      const baseUrl = compilerOptions.baseUrl ?? ".";

      tsconfigCache.set(cacheKey, { mtime: stat.mtime, paths, baseUrl });
      return { paths, baseUrl, tsconfigPath };
    } catch {
      // no tsconfig in this dir
    }

    const parent = path.dirname(dir);
    if (parent === dir) break;
    if (root && !dir.startsWith(root)) break;
    dir = parent;
  }

  return undefined;
}

/**
 * @param {string} text
 * @returns {string}
 */
function stripJsonComments(text) {
  return text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
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
  const exclude =
    "**/{.git,node_modules,dist,build,out,.venv,venv,__pycache__,.next,coverage}/**";
  const found = await vscode.workspace.findFiles(include, exclude, 50);
  if (found.length === 0) return undefined;

  return pickBestFileCandidate(sourceDocument, found);
}

/**
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
 * Class/instance method or property in any class body (e.g. userService.ts.getById).
 *
 * @param {vscode.TextDocument} doc
 * @param {string} memberName
 * @returns {vscode.Position | undefined}
 */
function findMethodInFile(doc, memberName) {
  const escaped = escapeRegExp(memberName);
  const memberRe = new RegExp(
    `^\\s+(?:(?:public|private|protected|readonly|static|async|get|set)\\s+)*${escaped}\\s*[(=:<]`
  );

  for (let i = 0; i < doc.lineCount; i += 1) {
    const line = doc.lineAt(i).text;
    if (memberRe.test(line)) {
      const col = Math.max(0, line.indexOf(memberName));
      return new vscode.Position(i, col);
    }
  }

  return undefined;
}

/**
 * @param {vscode.TextDocument} doc
 * @param {string} symbolName
 * @returns {vscode.Position | undefined}
 */
function findSymbolLocation(doc, symbolName) {
  const escaped = escapeRegExp(symbolName);
  /** @type {Record<string, RegExp>} */
  const patterns = {
    function: new RegExp(
      `^\\s*(?:export\\s+)?(?:async\\s+)?function\\s+${escaped}\\s*[(<]`
    ),
    class: new RegExp(`^\\s*(?:export\\s+)?class\\s+${escaped}\\s*[<{]`),
    interface: new RegExp(`^\\s*(?:export\\s+)?interface\\s+${escaped}\\s*[<{]`),
    type: new RegExp(`^\\s*(?:export\\s+)?type\\s+${escaped}\\s*[<=]`),
    enum: new RegExp(`^\\s*(?:export\\s+)?enum\\s+${escaped}\\s*[{<]`),
    const: new RegExp(`^\\s*(?:export\\s+)?const\\s+${escaped}\\s*[=:<]`),
  };

  for (const kind of SYMBOL_KIND_ORDER) {
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
