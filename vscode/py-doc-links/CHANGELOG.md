# Changelog

## 0.2.9

- Maintenance release: version bump and release metadata update.

## 0.2.8

- Cursor referral link in readme **Author** / **Автор** section.

## 0.2.7

- Added Sphinx navigation for classes and module-level variables: `:py:class:`, `:class:`, `:py:data:`, `:data:`, `:py:attr:`, `:attr:` (VS Code and JetBrains `PySymbolReference`).
- `:py:func:` / `:func:` fall back to class and assignment when no `def` is found (e.g. `:py:func:`config.hosters_data`` → `hosters_data =` in `config.py`).
- JetBrains: `CHANGELOG.md`, Marketplace `changeNotes`, updated `plugin.xml` / `build.gradle.kts` description.
- Version aligned with JetBrains `0.2.7` release.

## 0.2.6

- File/module/function resolution prefers `main.py` (and other duplicates) in the **same directory** as the source file; de-prioritizes matches under `docs/`, `!to_tg/`, and `examples/`.
- Version aligned with JetBrains `0.2.6` release.

## 0.2.5

- Fixed README/Markdown rendering of Sphinx patterns with inner backticks (use `<code>` so `:py:func:`module.func`` displays correctly on Marketplace and in the extension Details view).
- Version aligned with JetBrains `0.2.5` release.

## 0.2.4

- LICENSE copyright line aligned with monorepo (`Rufat Nuriyev and plugins contributors`).
- Version aligned with JetBrains `0.2.4` release.

## 0.2.3

- JetBrains: optional Python plugin dependency (Marketplace verification on IntelliJ IDEA without bundled Python).
- Version aligned with JetBrains `0.2.3` release.

## 0.2.2

- Fixed README links for VS Code Marketplace (absolute GitHub URLs, `vsce.baseContentUrl` for monorepo).

## 0.2.1

- Fixed VS Code Marketplace publisher ID: `rufat` (was `rufatpro`).

## 0.2.0

- Added tolerant parsing/resolve for <code>:py:func:`module.py.func`</code> and <code>:func:`module.py.func`</code>.
- Added support for `:func:`func`` in the current file.
- Improved matcher priority so Sphinx references win over plain `filename.py` overlaps.
- Updated examples and docs to use `main.py` / `submodule.py`.

## 0.1.0

- Initial release.
- Added go-to-definition for Python docstring/comment references:
  - `filename.py`
  - <code>:py:func:`module.func`</code>
  - <code>:py:func:`module.py.func`</code> (tolerant)
  - <code>:func:`module.func`</code>
  - <code>:func:`module.py.func`</code> (tolerant)
  - <code>:func:`func`</code> (current file)
  - <code>:py:mod:`module`</code> / <code>:py:mod:`module.py`</code>
