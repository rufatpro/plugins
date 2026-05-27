# Cursor Chat Prompt Library

[Русский](readme_ru.md) · [Releases](https://github.com/rufatpro/ide-plugins/releases) · [Repository](https://github.com/rufatpro/ide-plugins) · [Release guide](../../../readme_github_release_cursor-chat-prompt-library.md)

**QuickPick** templates for **Cursor AI chat** — pick a prompt and insert into chat (Composer & Agent).

**710 templates** — 34 categories (**Python × 50**, others × 20):

| Tier | Categories |
|------|------------|
| Core | Website, Python, JavaScript, TypeScript, React, SQL, Git, Django |
| High demand | Next.js, FastAPI, Docker, Testing, Tailwind CSS |
| Strong demand | Node.js, Vue, PHP, Laravel, C#/.NET, Java/Spring, Linux/Bash, CI/CD, REST/OpenAPI, MongoDB, Mobile |
| Growing / niche | C, C++, Go, Rust, Kubernetes, AWS/Cloud, WordPress, Data/Pandas, Security, GraphQL |

> Part of the [ide-plugins](https://github.com/rufatpro/ide-plugins) monorepo.

## Hotkey (primary)

| Key | Action |
|-----|--------|
| **Ctrl+Alt+Shift+P** (Windows/Linux) | **Step 1:** category (34 types) → **Step 2:** prompt → insert into chat |
| **Cmd+Alt+Shift+P** (macOS) | Same |

## Commands

| Command | Action |
|---------|--------|
| **Pick Prompt (Category, then Template)** | Same as hotkey (two steps) |
| **Insert Prompt into Chat (All Categories)** | Single list, all 710 prompts |
| **Insert Website / Python / JavaScript Prompt** | One category only (legacy shortcuts) |

### Via Command Palette

> **F1** or `Ctrl+Shift+P` → **Pick Prompt** (or filter `Cursor Chat Prompt Library`).  
> Use when you do not remember the hotkey or it conflicts with another extension.

## Requirements

- **Cursor** recommended (`workbench.action.chat.open` and Composer commands).
- Plain VS Code: prompts copy to clipboard if chat cannot open.

## Install (development)

```bat
cd ide-plugins\vscode\cursor-chat-prompt-library
build.bat
cursor --install-extension build\cursor-chat-prompt-library-0.7.3.vsix
```

Reload the window. Primary: **Ctrl+Alt+Shift+P** (see **Via Command Palette** for **F1**).

## Maintaining prompts

- Bundled data: `prompts/*.json` (one file per category).
- Regenerate extended categories (batch 1): `node scripts/generate-extra-categories.mjs`
- Append batch 2 (+10 per file): `node scripts/append-batch-2.mjs` (uses `scripts/batch-2-prompts.mjs`)
- Display order: `CATEGORY_FILE_ORDER` in `src/promptStore.js`.

## License

[MIT](https://github.com/rufatpro/ide-plugins/blob/main/license) — free to use, modify, and distribute, at your own risk.  
[ide-plugins monorepo](https://github.com/rufatpro/ide-plugins) · [Releases](https://github.com/rufatpro/ide-plugins/releases)

## Author

[Rufat](https://rufat.top/)

**Cursor IDE:** [Sign up with referral link](https://cursor.com/referral?code=GCE2SLLVIM87) — supports the author when you subscribe.
