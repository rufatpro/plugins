# Cursor Chat Prompt Library

[English](readme.md) · [Releases](https://github.com/rufatpro/ide-plugins/releases) · [Репозиторий](https://github.com/rufatpro/ide-plugins) · [Инструкция релиза](../../../readme_github_release_cursor-chat-prompt-library.md)

Библиотека шаблонов для **AI-чата Cursor**: QuickPick → вставка в чат.

**31 категория × 20 промптов = 620 шаблонов:**

| Уровень | Категории |
|---------|-----------|
| Базовые | Сайт, Python, JavaScript, TypeScript, React, SQL, Git, Django |
| Высокий спрос | Next.js, FastAPI, Docker, Testing, Tailwind CSS |
| Сильный спрос | Node.js, Vue, PHP/Laravel, C#/.NET, Java/Spring, Linux/Bash, CI/CD, REST/OpenAPI, MongoDB, Mobile |
| Нишевые / растущие | Go, Rust, Kubernetes, AWS, WordPress, Data/Pandas, Security, GraphQL |

> Часть monorepo [ide-plugins](https://github.com/rufatpro/ide-plugins).

## Горячая клавиша

| Клавиша | Действие |
|---------|----------|
| **Ctrl+Alt+P** | **Шаг 1:** категория (31 тип) → **шаг 2:** промпт → вставка в чат |
| **Cmd+Alt+P** (macOS) | То же |

## Команды

| Команда | Действие |
|---------|----------|
| **Pick Prompt (Category, then Template)** | Как горячая клавиша |
| **Insert Prompt into Chat (All Categories)** | Один список из 620 промптов |
| **Insert Website / Python / JavaScript** | Быстрый вход в одну категорию |

Палитра: `Ctrl+Shift+P` → `Cursor Chat Prompt Library`.

## Установка

```bat
cd ide-plugins\vscode\cursor-chat-prompt-library
build.bat
cursor --install-extension build\cursor-chat-prompt-library-0.4.2.vsix
```

Перезагрузите окно.

## Поддержка каталога

- Файлы: `prompts/*.json`
- Batch 1 (23 категории): `node scripts/generate-extra-categories.mjs`
- Batch 2 (+10 в каждый файл): `node scripts/append-batch-2.mjs`
- Порядок в списке: `CATEGORY_FILE_ORDER` в `src/promptStore.js`

## Лицензия

[MIT](https://github.com/rufatpro/ide-plugins/blob/main/license) — свободное использование, изменение и распространение на ваш риск.  
[monorepo ide-plugins](https://github.com/rufatpro/ide-plugins) · [Releases](https://github.com/rufatpro/ide-plugins/releases)

## Автор

[Руфат](https://rufat.top/)
