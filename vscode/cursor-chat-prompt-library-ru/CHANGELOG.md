# Changelog

## 0.3.0

- Категория **Python**: **50** промптов (`py-21` … `py-50`), переводы на русский.
- Всего шаблонов: **650** (31 категория; Python × 50, остальные × 20).

## 0.2.1

- Расширено описание расширения (`description`): ключевые слова AI, ИИ, Chat, Чат, Cursor, Курсор, Prompt, Промпт.

## 0.2.0

- Все 620 промптов переведены на русский: `categoryLabel`, `label`, `description`, `detail`, `text`.
- Сообщения расширения и QuickPick — на русском.
- Документация: `readme.md` (RU по умолчанию), `readme_en.md` (EN).

## 0.1.0

- Initial release of `cursor-chat-prompt-library-ru` based on `cursor-chat-prompt-library` 0.4.3.
- Separate extension id/commands so RU and original extensions can be installed together.

## 0.4.3

- Upstream history from `cursor-chat-prompt-library`.

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
