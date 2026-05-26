# ide-plugins

[English](README.md) · [Releases](https://github.com/rufatpro/ide-plugins/releases)

Монорепозиторий плагинов и расширений для IDE — **JetBrains**, **VS Code** и другие.  
Каждый плагин живёт в своём каталоге со своим `readme.md`.

**Исследование:** [Возможные плагины для Cursor](../possible_plugins/possible_plugins.md) — пробелы рынка и 10 идей (RU).

## Каталог плагинов

| Плагин | Платформа | Версия | Описание | Документация |
|--------|-----------|--------|----------|--------------|
| [AI Chat File Links](jetbrains/ai-chat-file-links/) | JetBrains | 0.3.1 | Исправляет проблему: ссылки на файлы из **AI Chat** не открывались в редакторе (PyCharm, IntelliJ, WebStorm, …) | [EN](jetbrains/ai-chat-file-links/readme.md) · [RU](jetbrains/ai-chat-file-links/readme_ru.md) |
| [Python Doc Links](jetbrains/py-doc-links/) | JetBrains | 0.2.7 | Ctrl+Click в Python **docstring** / **комментариях** (`filename.py`, `:py:func:`, `:py:class:`, `:py:data:`, `:py:mod:`, короткие формы) | [EN](jetbrains/py-doc-links/readme.md) · [RU](jetbrains/py-doc-links/readme_ru.md) |
| [Python Doc Links](vscode/py-doc-links/) | VS Code / Cursor | 0.2.7 | Ctrl+Click по ссылкам в Python docstring/комментариях (`filename.py`, `:py:func:`, `:py:class:`, `:py:data:`, `:py:mod:`, короткие формы) | [EN](vscode/py-doc-links/readme.md) · [RU](vscode/py-doc-links/readme_ru.md) |
| [Multiline Find](vscode/multiline-find/) | VS Code / Cursor | 0.1.3 | **Ctrl+F** в стиле PyCharm для многострочного выделения; **F3** ищет по всему файлу | [EN](vscode/multiline-find/readme.md) · [RU](vscode/multiline-find/readme_ru.md) |
| [Python Quick Intent](vscode/python-quick-intent/) | VS Code / Cursor | 0.4.0 | **Alt+Enter** в стиле PyCharm: импорт, Fix with AI, Quick Edit для Python в Cursor | [EN](vscode/python-quick-intent/readme.md) · [RU](vscode/python-quick-intent/readme_ru.md) |
| [TypeScript Doc Links](vscode/ts-doc-links/) | VS Code / Cursor | 0.1.3 | Ctrl+Click в TS/JS **комментариях** / **JSDoc** (`@see`, `{@link ./file.ts}`, `File:`, `// See`, алиасы `@/`) | [EN](vscode/ts-doc-links/readme.md) · [RU](vscode/ts-doc-links/readme_ru.md) |

> Расширения для VS Code/Cursor живут в `vscode/<имя>/`.

## Структура репозитория

```
ide-plugins/            ← корень git (плагины)
  README.md             # индекс (EN)
  README_RU.md          # индекс (RU)
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
../possible_plugins/    # исследование (идеи плагинов для Cursor)
```

## Лицензия

[MIT](license) — свободное использование, изменение и распространение, на свой страх и риск (JetBrains Marketplace, VS Code Marketplace / Open VSX).

## Автор

[Руфат](https://rufat.top/)
