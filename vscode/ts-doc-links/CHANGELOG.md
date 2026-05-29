# Changelog

## 0.1.7 — 2026-05-29

- Readme: removed release guide link from header.

## 0.1.6 — 2026-05-29

- Repository moved to [github.com/rufatpro/plugins](https://github.com/rufatpro/plugins); updated metadata URLs.

## 0.1.5 — 2026-05-27

- Maintenance release: version bump and release metadata update.

## 0.1.4 — 2026-05-26

- Cursor referral link in readme **Author** / **Автор** section.

## 0.1.3 — 2026-05-26

- Display name: **TypeScript Doc Links** (package id remains `ts-doc-links`).

## 0.1.2 — 2026-05-26

- `{@link module.ts.symbol}` resolves to class methods (e.g. `userService.ts.getById`), not only file start.

## 0.1.1 — 2026-05-26

- `{@link Class#member}` and `{@link Class.method}` (e.g. `UserService#getById`, `UserService.getById`).
- Resolves via import in the current file, then workspace search for `class ClassName`.

## 0.1.0 — 2026-05-26

- Initial release for VS Code / Cursor.
- `@see`, `{@link ./file.ts}`, `File:`, `// See`, backtick paths, `file:line` / `#Lline`.
- Relative paths from current file; workspace search with same-folder / `docs/` priority.
- `{@link Symbol}`, `module.export`, `module.ts.symbol`.
- `tsconfig.json` path aliases (`@/*`).
- Languages: `typescript`, `javascript`, `typescriptreact`, `javascriptreact`.
