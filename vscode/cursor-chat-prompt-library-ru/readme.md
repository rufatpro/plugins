# Cursor Chat Prompt Library RU

[English](readme_en.md) · [Releases](https://github.com/rufatpro/ide-plugins/releases) · [Репозиторий](https://github.com/rufatpro/ide-plugins)

Библиотека **620 русскоязычных** шаблонов Промптов (Prompts) для AI-Chat в **Cursor**: Быстрый выбор → вставка в ИИ Чат Курсора.

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
| **Выбрать промпт (категория → шаблон)** | Как горячая клавиша |
| **Вставить промпт в чат (все категории)** | Один список из 620 промптов |
| **Вставить промпт Website / Python / JavaScript** | Быстрый вход в одну категорию |

Палитра: `Ctrl+Shift+P` → `Cursor Chat Prompt Library RU`.

## Требования

- Рекомендуется **Cursor** (`workbench.action.chat.open` и команды Composer).
- В обычном VS Code: если чат не открывается, промпт копируется в буфер обмена.

## Установка

```bat
cd ide-plugins\vscode\cursor-chat-prompt-library-ru
build.bat
cursor --install-extension build\cursor-chat-prompt-library-ru-0.2.1.vsix
```

Перезагрузите окно. Нажмите **Ctrl+Alt+P** или выполните **Выбрать промпт**.

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

**Cursor IDE:** [Регистрация по реферальной ссылке](https://cursor.com/referral?code=GCE2SLLVIM87) — при подписке поддерживаете автора.
