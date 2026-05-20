# ide-plugins

**English** · [README_RU](README_RU.md) (Russian)

**Repository:** [github.com/rufatpro/ide-plugins](https://github.com/rufatpro/ide-plugins)

Monorepo of IDE plugins and extensions (JetBrains, **VS Code**, …). Each plugin has its own directory and `readme.md`.

**Current plugin — [AI Chat File Links](jetbrains/ai-chat-file-links/):** in **PyCharm** and other **JetBrains** IDEs, file links in **AI Chat** (e.g. **Cursor** via ACP) often **did not open in the editor** when clicked — only «Cannot open a URL» / «File does not exist», although the file is under the project root. That plugin fixes this; future plugins in this repo may address other problems.

Platforms:

| Platform | Directory | Environment |
|----------|-----------|-------------|
| **JetBrains** | [JetBrains](jetbrains/) (`jetbrains/`) | PyCharm, IntelliJ IDEA, WebStorm, … — IntelliJ Platform plugins |
| **VS Code** | [VS Code](vscode/) (`vscode/`, planned) | Visual Studio Code and compatible editors — extensions (Extension API) |

Right now there is one **JetBrains** plugin (**AI Chat File Links**). **VS Code** extensions will go under `vscode/<name>/` when added (same layout: `readme.md`, build scripts, MIT [license](license) at the repo root).

**Git repository root** is this directory (`README.md`, `README_RU.md`, [license](license), JetBrains plugins under `jetbrains/…`; run `git init` here). Build:

```bash
cd jetbrains/ai-chat-file-links
./build.sh
```

**Parent workspace** (e.g. with `chat-specstory-history/`): same plugin — `cd ide-plugins/jetbrains/ai-chat-file-links` (or `ide-plugins\jetbrains\ai-chat-file-links` on Windows).

**File naming:** plugin docs and [license](license) use lowercase — `readme.md`, `readme_ru.md`, `license` (not `LICENSE` in plugin folders).

**License:** [MIT](license) — use, modify, and distribute freely (JetBrains and VS Code).  
**Disclaimer:** all software here is provided **as is, at your own risk**; authors are not liable for IDE/editor failures, data loss, etc. See [license](license) (JetBrains Marketplace, VS Code Marketplace / Open VSX).

---

## Plugin catalog

| Plugin | Platform | ID | Version | Summary | Docs |
|--------|----------|-----|--------|---------|------|
| [AI Chat File Links](jetbrains/ai-chat-file-links/) | JetBrains (PyCharm, IDEA, …) | `com.aichat.filelinks` | 0.2.0 | **Fix:** file links from **AI Chat** open in the editor (PyCharm etc.) instead of failing; optional setting closes the error balloon after a successful open | [readme.md](jetbrains/ai-chat-file-links/readme.md) · [readme_ru.md](jetbrains/ai-chat-file-links/readme_ru.md) |

---

## JetBrains

### [AI Chat File Links](jetbrains/ai-chat-file-links/)

**Purpose:** fix the case when **PyCharm** / **IntelliJ** / **WebStorm** **AI Chat** shows a file path in an agent reply (Cursor, ACP, …) but **clicking the link does not open the file** in the editor. Developed with **AI assistance** (Cursor / LLM).

**Problem:** you click a path in AI Chat (e.g. `src/app/settings.py`); the file exists at the project root, yet the IDE reports «Cannot open a URL» or «File … does not exist» and nothing opens — typical on **Windows** with ACP agents.

**Solution:**

- link click hook (`UrlOpener`) — resolves `project root + relative path`;
- error notification hook — extracts path, copies to clipboard, opens in editor;
- **Tools → AI Chat File Links** — open from clipboard or last failed path;
- **Settings → Tools → AI Chat File Links** — dismiss error notification after successful open (enabled by default).

**Requirements:** IDE 2024.3+ (`sinceBuild` 243), **AI Assistant** enabled, Cursor agent (ACP), project opened at the **repository root**.

**Plugin directory files:**

| File | Purpose |
|------|---------|
| [readme.md](jetbrains/ai-chat-file-links/readme.md) | documentation (EN) |
| [readme_ru.md](jetbrains/ai-chat-file-links/readme_ru.md) | documentation (RU) |
| `build.sh` / `build.bat` | build zip |
| `clean.sh` / `clean.bat` | clean `build/`, caches |
| `gradlew` / `gradlew.bat` | Gradle Wrapper |

**Build** (from git repo root):

```bash
cd jetbrains/ai-chat-file-links
chmod +x gradlew build.sh clean.sh   # Linux/macOS, once
./build.sh
```

Windows:

```powershell
cd jetbrains\ai-chat-file-links
.\build.bat
```

Artifact: `build/distributions/ai-chat-file-links-*.zip`.

---

## VS Code

**Visual Studio Code** extensions (and forks like VSCodium) go in `vscode/<name>/` (TypeScript/JavaScript, `package.json`, `.vsix`). Publish via [Visual Studio Marketplace](https://marketplace.visualstudio.com/) and/or [Open VSX](https://open-vsx.org/).

No **VS Code** plugin is published here yet. If one is added later, it will be listed in the catalog with its own description (not necessarily the same AI Chat link issue).

---

## Layout (for new plugins)

```text
<git root ide-plugins/>/
  README.md              # index (EN)
  README_RU.md           # index (RU)
  license                # MIT + disclaimer
  .gitignore             # **/build/, **/.gradle/, …
  jetbrains/             # JetBrains — IntelliJ Platform (.zip)
    <plugin-name>/
      build.gradle.kts
      src/
  vscode/                # VS Code — extension (.vsix), when added
    <extension-name>/
      package.json
      src/
  <platform>/<name>/
      readme.md          # EN (plugin)
      readme_ru.md       # RU (optional)
      build.sh / build.bat   # JetBrains
      clean.sh / clean.bat
```

When adding a plugin: new row in the table, section under the platform, links to `readme.md` / `readme_ru.md`.
