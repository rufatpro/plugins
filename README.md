# ide-plugins

[Русский](README_RU.md) · [Releases](https://github.com/rufatpro/ide-plugins/releases)

Monorepo of IDE plugins and extensions — **JetBrains**, **VS Code**, and more.  
Each plugin lives in its own directory with a `readme.md`.

## Plugin catalog

| Plugin | Platform | Version | Summary | Docs |
|--------|----------|---------|---------|------|
| [AI Chat File Links](jetbrains/ai-chat-file-links/) | JetBrains | 0.2.0 | Fixes file links from **AI Chat** not opening in the editor (PyCharm, IntelliJ, WebStorm, …) | [EN](jetbrains/ai-chat-file-links/readme.md) · [RU](jetbrains/ai-chat-file-links/readme_ru.md) |
| [Python Doc Links](jetbrains/py-doc-links/) | JetBrains | 0.2.0 | Adds Ctrl+Click navigation for file/function references in Python **docstrings** and **comments** (`filename.py`, `:py:func:`, `:func:`, `:py:mod:`) | [EN](jetbrains/py-doc-links/readme.md) · [RU](jetbrains/py-doc-links/readme_ru.md) |
| [Python Doc Links](vscode/py-doc-links/) | VS Code / Cursor | 0.2.0 | Adds Ctrl+Click navigation for Python docstring/comment references (`filename.py`, `:py:func:`, `:func:`, `:py:mod:`) | [EN](vscode/py-doc-links/readme.md) · [RU](vscode/py-doc-links/readme_ru.md) |

> VS Code/Cursor extensions live under `vscode/<name>/`.

## Repository layout

```
ide-plugins/            ← git root
  README.md             # index (EN)
  README_RU.md          # index (RU)
  license               # MIT
  jetbrains/
    <plugin-name>/
      readme.md
      build.gradle.kts
      src/
  vscode/
    <extension-name>/
      readme.md
      package.json
      src/
```

## License

[MIT](license) — free to use, modify, and distribute, at your own risk (JetBrains Marketplace, VS Code Marketplace / Open VSX).
