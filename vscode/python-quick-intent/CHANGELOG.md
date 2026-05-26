# Changelog

All notable changes to **Python Quick Intent** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.4.1] - 2026-05-26

### Changed

- Cursor referral link in readme **Author** / **Автор** section.

## [0.4.0] - 2026-05-25

### Changed

- Aligned with [ide-plugins](https://github.com/rufatpro/ide-plugins) monorepo layout: `src/extension.js`, publisher `rufat`, `build/` VSIX output, repository and `vsce.baseContentUrl` for Marketplace.
- Added `readme_ru.md`, monorepo-style `LICENSE`, and catalog entries in root `README.md` / `README_RU.md`.
- Removed development `_probe-*.js` scripts from the extension folder.

## [0.3.4] - 2026-05-25

### Fixed

- **Fix with AI** keeps the @-mention link to the selected lines in Composer (`composer.addsymbolstonewcomposer`) and adds only the instruction text + analyzer messages — code is no longer duplicated inline in the prompt.

## [0.3.3] - 2026-05-25

### Fixed

- **Fix with AI** uses `workbench.action.chat.open` with the prompt string (native Composer API). Older commands that opened an empty chat are no longer used.

## [0.3.2] - 2026-05-25

### Changed

- **Quick edit** (was “AI completion”) opens Cursor Quick Edit (`editor.cmdk.show`, Ctrl+K) with the diagnostic line selected instead of generic autocomplete.

## [0.3.1] - 2026-05-25

### Fixed

- **Fix with AI** now inserts the prompt into Cursor chat (native prompt commands, then `composer.newAgentChat` + `composer.focusComposer` + paste), instead of only copying to the clipboard.

## [0.3.0] - 2026-05-25

### Changed

- All user-visible strings and command titles are now in English.
- Added `readme.md`, `CHANGELOG.md`, and `LICENSE` (MIT).

## [0.2.3] - 2026-05-25

### Changed

- **Alt+Enter** on code without diagnostics delegates to `editor.action.quickFix` (system default).

## [0.2.2] - 2026-05-25

### Changed

- Quick Intent menu appears only when the cursor is on underlined code (active diagnostics).

## [0.2.1] - 2026-05-25

### Changed

- Intention menu opens at the cursor (Code Action UI) instead of a top Quick Pick panel.

## [0.2.0] - 2026-05-25

### Added

- Three-item intention menu: Import, Fix with AI, AI completion.

## [0.1.2] - 2026-05-25

### Added

- Workspace module discovery: inserts `import <name>` when `<name>.py` exists.
- Avoids hanging on empty Quick Fix from the language server.

## [0.1.1] - 2026-05-25

### Changed

- **Alt+Enter** keybinding and conflict handling with IntelliJ Keybindings.

## [0.1.0] - 2026-05-25

### Added

- Initial release: import, AI fix, AI completion commands.
- `build.bat` and `clean.bat` for VSIX packaging.
