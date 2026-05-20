# AI Chat File Links

Path in repo: `jetbrains/ai-chat-file-links/` (from git root [`README.md`](../../README.md)).  
Repository: [github.com/rufatpro/ide-plugins](https://github.com/rufatpro/ide-plugins)

IntelliJ Platform plugin for **PyCharm**, **IntelliJ IDEA**, and other **JetBrains** IDEs.

This repository also hosts **VS Code** extensions under `vscode/` (see [repo index](../../README.md)); this package is **JetBrains-only** — it does not install in VS Code. In VS Code / Cursor desktop, file links in chat are handled by the editor itself.

When you use the **Cursor** agent via [ACP](https://agentclientprotocol.com/) in **AI Chat**, file links in agent responses often fail on Windows with errors like:

- `Cannot open a URL`
- `File src\app\some\file.py does not exist`

The file exists under the project root, but the IDE treats the path as an external URL instead of a project-relative file. This plugin resolves those paths and opens the file in the editor.

**Settings** (`Settings → Tools → AI Chat File Links`): **Dismiss error notification when the file opens successfully** (enabled by default) — after the file opens, closes the IDE error popup («Cannot open a URL», «File does not exist»).

**Note:** this plugin was developed with **AI assistance** (Cursor / LLM).

**Russian documentation:** [readme_ru.md](readme_ru.md)

## Features

1. **UrlOpener (priority)** — on link click, tries `project.basePath + relative path` before the default URL handler.
2. **Error notification hook** — when a balloon shows `File … does not exist` or `Cannot open a URL`, the plugin:
   - extracts the path from the notification text;
   - copies it to the clipboard;
   - opens the file in the editor;
   - remembers it for **Open Last Failed Path**.
3. **Manual actions** — **Tools → AI Chat File Links** or **Find Action** (`Shift` twice):
   - **Open Path from Clipboard**
   - **Open Last Failed Path**

No default keyboard shortcuts (avoids conflicts with IDE keymaps).

## Settings

**Settings → Tools → AI Chat File Links**

| Option | Default | Description |
|--------|---------|-------------|
| **Dismiss error notification when the file opens successfully** | on | After the file opens (chat link, error balloon, or auto-open), closes the IDE error popup about «Cannot open a URL» or «File does not exist». |

## Requirements

- JetBrains IDE **2024.3+** (`sinceBuild` 243)
- **AI Assistant** plugin enabled
- **Cursor** agent from the ACP Registry (or another ACP agent that shows the same error balloons)
- Project opened at the **repository root** (not only a subfolder)

## Installation

### From a release

1. Download `ai-chat-file-links-*.zip` from [GitHub Releases](https://github.com/rufatpro/ide-plugins/releases) or build locally.
2. **Settings → Plugins → ⚙ → Install Plugin from Disk…**
3. Select the zip file.
4. **Restart** the IDE.

### From source

Linux / macOS (from git repo root):

```bash
cd jetbrains/ai-chat-file-links
chmod +x gradlew build.sh clean.sh   # once, if needed
./build.sh
# or: ./gradlew buildPlugin
```

Windows:

```powershell
cd jetbrains\ai-chat-file-links
build.bat
# or: gradlew.bat buildPlugin
```

From a parent workspace folder: `cd ide-plugins/jetbrains/ai-chat-file-links` (same commands).

Install `build/distributions/ai-chat-file-links-*.zip` as above.

**Upgrading from `acp-path-opener`:** uninstall the old plugin (`com.acp.pathopener`), then install `com.aichat.filelinks` — plugin IDs differ, so both cannot stay enabled.

## Usage

1. Open your project at the repository root.
2. In **AI Chat**, select the **Cursor** agent (ACP).
3. Click a file path in the agent response.

**Expected:** the file opens in the editor. If the IDE still shows an error balloon, the path should be copied to the clipboard and opened shortly after.

**Fallback:**

- **Tools → AI Chat File Links → Open Last Failed Path**
- Copy the path from the chat → **Tools → AI Chat File Links → Open Path from Clipboard**
- **Find Action** → type `AI Chat` or `Open Path`

## Build from source

### Run in a sandbox IDE

```bash
cd jetbrains/ai-chat-file-links
./gradlew runIde
```

Windows:

```powershell
cd jetbrains\ai-chat-file-links
gradlew.bat runIde
```

### Clean build artifacts

```bash
./clean.sh
```

Windows: `clean.bat`

Removes `build/`, `.gradle/`, `.intellijPlatform/`, `.kotlin/`, and Gradle `log.*.log` files. On Linux, debug logs in `/tmp/ai-chat-file-links-*.log` are removed too.

## Build logs

`log.1main.log` — Gradle output; success ends with `BUILD SUCCESSFUL`.

`log.1err.log` — stderr from `buildSearchableOptions` when enabled (headless IDE). **WARN** lines there are usually IntelliJ platform noise, not plugin errors. `buildSearchableOptions` is disabled in `build.gradle.kts` for shorter logs.

## How it works

```text
Click in AI Chat
    → BrowserUtil / UrlOpener (plugin tries project-relative path)
    → on failure: IDE shows "Cannot open a URL" balloon
    → Notifications.TOPIC + BalloonListener (plugin captures text)
    → path → clipboard + OpenFileDescriptor(project, file)
```

AI Chat uses **Jewel / Compose** for rendering; link handling is not the standard editor hyperlink API. The plugin hooks IDE notification and browser layers instead.

## Limitations

- **Windows-focused** — developed and tested with Windows path separators.
- **JetBrains only** — not a VS Code extension; see `vscode/` in the repo for future VS Code targets.
- **ACP / Cursor in JetBrains** — does not fix link handling inside the **Cursor** or **VS Code** desktop apps.
- **Project root matters** — paths must be relative to the opened project root.
- **Upstream fix preferred** — JetBrains and Cursor may eventually resolve links natively; report platform issues to [JetBrains YouTrack LLM](https://youtrack.jetbrains.com/newIssue?project=LLM).

## Related

- [Cursor — JetBrains integration](https://cursor.com/docs/integrations/jetbrains)
- [Agent Client Protocol](https://agentclientprotocol.com/)
- [JetBrains AI Assistant — ACP](https://www.jetbrains.com/help/ai-assistant/acp.html)

## Debug logging (optional)

File logging to `C:\tmp\` is **disabled** in release builds. To enable it, set `ENABLED = true` in `DebugLog.kt`, uncomment the write block, register debug listeners in `plugin.xml`, and uncomment `NotificationDebugPoller.start()` in `SubscribeOnAppStartListener.kt`. Log file names and hooks: [readme_ru.md](readme_ru.md) (section «отладка»).

## License

[MIT](../../license) — free to use, modify, and distribute (repo covers JetBrains and VS Code extensions). **Use at your own risk**; see disclaimer in [license](../../license).
