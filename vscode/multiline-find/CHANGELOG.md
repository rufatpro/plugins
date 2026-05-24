# Changelog

## 0.1.3

- Fixed no matches on CRLF files (Windows): normalize `\r\n` in the search string to `\n` before find (VS Code multiline search uses LF internally).

## 0.1.2

- Fixed no matches when the cursor was left at the end of the selection: collapse to **start**, not `active`, before opening find.

## 0.1.1

- LICENSE copyright aligned with monorepo.
- `build.bat` / `clean.bat`; VSIX output under `build/`.
- `configurationDefaults` for recommended editor find settings.
- Documentation (readme EN/RU).

## 0.1.0

- Initial VSIX release
- Multiline Ctrl+F with file-wide search (F3)
- Keybinding overrides default editor find
- Default values for `editor.find.autoFindInSelection` and `editor.find.seedSearchStringFromSelection` via `configurationDefaults`
