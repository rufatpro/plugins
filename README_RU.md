# ide-plugins

[English](README.md) · [Releases](https://github.com/rufatpro/ide-plugins/releases)

Монорепозиторий плагинов и расширений для IDE — **JetBrains**, **VS Code** и другие.  
Каждый плагин живёт в своём каталоге со своим `readme.md`.

## Каталог плагинов

| Плагин | Платформа | Версия | Описание | Документация |
|--------|-----------|--------|----------|--------------|
<<<<<<< HEAD
| [AI Chat File Links](jetbrains/ai-chat-file-links/) | JetBrains | 0.3.1 | Исправляет проблему: ссылки на файлы из **AI Chat** не открывались в редакторе (PyCharm, IntelliJ, WebStorm, …) | [EN](jetbrains/ai-chat-file-links/readme.md) · [RU](jetbrains/ai-chat-file-links/readme_ru.md) |
=======
| [AI Chat File Links](jetbrains/ai-chat-file-links/) | JetBrains | 0.2.0 | Исправляет проблему: ссылки на файлы из **AI Chat** не открывались в редакторе (PyCharm, IntelliJ, WebStorm, …) | [EN](jetbrains/ai-chat-file-links/readme.md) · [RU](jetbrains/ai-chat-file-links/readme_ru.md) |
>>>>>>> 338229b82f454cc642873c5a3c62b60b0cbc8fed
| [Python Doc Links](jetbrains/py-doc-links/) | JetBrains | 0.2.3 | Добавляет Ctrl+Click-навигацию по ссылкам на файлы и функции в Python **docstring** и **комментариях** (`filename.py`, `:py:func:`, `:func:`, `:py:mod:`) | [EN](jetbrains/py-doc-links/readme.md) · [RU](jetbrains/py-doc-links/readme_ru.md) |
| [Python Doc Links](vscode/py-doc-links/) | VS Code / Cursor | 0.2.3 | Добавляет Ctrl+Click-навигацию по ссылкам в Python docstring/комментариях (`filename.py`, `:py:func:`, `:func:`, `:py:mod:`) | [EN](vscode/py-doc-links/readme.md) · [RU](vscode/py-doc-links/readme_ru.md) |

> Расширения для VS Code/Cursor живут в `vscode/<имя>/`.

## Структура репозитория

```
ide-plugins/            ← корень git
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
```

## Лицензия

[MIT](license) — свободное использование, изменение и распространение, на свой страх и риск (JetBrains Marketplace, VS Code Marketplace / Open VSX).
