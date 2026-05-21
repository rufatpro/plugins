# ide-plugins

[English](README.md) · [Releases](https://github.com/rufatpro/ide-plugins/releases)

Монорепозиторий плагинов и расширений для IDE — **JetBrains**, **VS Code** и другие.  
Каждый плагин живёт в своём каталоге со своим `readme.md`.

## Каталог плагинов

| Плагин | Платформа | Версия | Описание | Документация |
|--------|-----------|--------|----------|--------------|
| [AI Chat File Links](jetbrains/ai-chat-file-links/) | JetBrains | 0.2.0 | Исправляет проблему: ссылки на файлы из **AI Chat** не открывались в редакторе (PyCharm, IntelliJ, WebStorm, …) | [EN](jetbrains/ai-chat-file-links/readme.md) · [RU](jetbrains/ai-chat-file-links/readme_ru.md) |

> Расширения для **VS Code** будут в `vscode/<имя>/` — пока не опубликованы.

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
  vscode/               # планируется
    <extension-name>/
      readme.md
      package.json
      src/
```

## Лицензия

[MIT](license) — свободное использование, изменение и распространение, на свой страх и риск (JetBrains Marketplace, VS Code Marketplace / Open VSX).
