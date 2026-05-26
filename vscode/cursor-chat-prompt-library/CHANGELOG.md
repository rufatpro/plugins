# Changelog

## 0.4.3

- Cursor referral link in readme **Author** / **Автор** section.

## 0.4.2

- Author block aligned with other ide-plugins extensions (`## Author` / `## Автор`, link [Rufat](https://rufat.top/)).

## 0.4.1

- Author line in readme (superseded by 0.4.2 format).

## 0.4.0

- **+10 prompts per category** (batch 2): each of 31 categories now has **20** templates (**620** total).
- Data: `scripts/batch-2-prompts.mjs`, apply with `node scripts/append-batch-2.mjs`.

## 0.3.0

- **23 new categories** (10 prompts each): Next.js, FastAPI, Docker, Testing, Tailwind, Node.js, Vue, PHP/Laravel, C#/.NET, Java/Spring, Linux/Bash, CI/CD, REST/OpenAPI, MongoDB, Mobile, Go, Rust, Kubernetes, AWS, WordPress, Data/Pandas, Security, GraphQL.
- **310** bundled templates (**31** categories total).
- Category list order in QuickPick; generator script `scripts/generate-extra-categories.mjs`.

## 0.2.0

- Five new categories (10 prompts each): **TypeScript**, **React**, **SQL**, **Git**, **Django**.
- **80** bundled templates total (8 categories).

## 0.1.1

- Hotkey **Ctrl+Alt+P** (`Cmd+Alt+P` on macOS): two-step QuickPick — category, then prompt.
- Command **Pick Prompt (Category, then Template)**.

## 0.1.0

- Initial release: QuickPick prompt library for Cursor AI chat.
- 30 bundled templates: 10 Website (HTML/CSS), 10 Python, 10 JavaScript.
- Insert via `workbench.action.chat.open` with clipboard fallback.
