# AI Chat — ссылки на файлы

Путь от корня git: `jetbrains/ai-chat-file-links/` ([`README_RU`](../../README_RU) репозитория).  
Репозиторий: [github.com/rufatpro/ide-plugins](https://github.com/rufatpro/ide-plugins)

**English:** [readme.md](readme.md) · [README](../../README)

Плагин для **JetBrains** (IntelliJ / PyCharm / WebStorm): открывает файлы по путям относительно корня проекта из **AI Chat** (агент Cursor и другие через ACP), когда IDE на Windows не может открыть ссылку («Cannot open a URL», «File … does not exist»).

Репозиторий также предназначен для расширений **VS Code** (`vscode/`, см. [README_RU](../../README_RU)); **этот** пакет — только JetBrains, в VS Code не ставится. В Cursor/VS Code ссылки в чате обрабатывает сам редактор.

**Настройки** (`Settings → Tools → AI Chat File Links`): **Dismiss error notification when the file opens successfully** (по умолчанию включено) — после успешного открытия файла закрывает всплывающее уведомление об ошибке («Cannot open a URL», «File … does not exist»).

**Примечание:** плагин создан **с помощью AI** (Cursor / LLM).

## что делает

1. **UrlOpener** — при клике по ссылке пытается открыть `project.basePath + путь` раньше стандартного обработчика URL.
2. **Перехват ошибки в чате** — при balloon «File … does not exist» / «Cannot open a URL» путь **копируется в буфер** и запоминается для **Open Last Failed Path**.
3. **Tools → AI Chat File Links** (подменю) или **Find Action** (`Shift` дважды) → `Open Path from Clipboard` / `Open Last Failed Path`. Горячие клавиши не назначены (чтобы не конфликтовать с IDE).

## настройки

**Settings → Tools → AI Chat File Links**

| Опция | По умолчанию | Описание |
|--------|--------------|----------|
| **Dismiss error notification when the file opens successfully** | включено | После успешного открытия файла (клик в чате, в balloon или авто-открытие) закрывает всплывающее уведомление «Cannot open a URL» / «File … does not exist». |

## логи сборки

`log.1main.log` — вывод Gradle. При успехе в конце: `BUILD SUCCESSFUL`.

`log.1err.log` — stderr задачи `buildSearchableOptions` (запуск headless IDE). Там обычно **WARN** (`SecurityException: setContextClassLoader`, `RegionUrlMapper`, `JBCefApp`) — это шум платформы IntelliJ, **не ошибки вашего плагина**. Сборка при этом может быть успешной.

В `build.gradle.kts` задача `buildSearchableOptions` отключена — логи короче, zip собирается так же.

## сборка и запуск

Из **корня git** (`ide-plugins/`):

```bash
cd jetbrains/ai-chat-file-links
chmod +x gradlew build.sh clean.sh   # один раз, если нет +x
./build.sh          # zip + log.1main.log / log.1err.log
./gradlew runIde    # песочница IDE
```

Windows (из git-корня):

```powershell
cd jetbrains\ai-chat-file-links
build.bat
gradlew.bat runIde
```

Из **workspace** (родитель с `chat-specstory-history/`):

```bash
cd ide-plugins/jetbrains/ai-chat-file-links
```

Windows: `cd ide-plugins\jetbrains\ai-chat-file-links` — те же `build.bat` / `gradlew.bat`.

Если нет `gradlew` / `gradle/wrapper/`: `gradle wrapper` (нужен установленный Gradle).

В песочнице IDE (`runIde`) откройте проект с **корнем репозитория** (`project.basePath`). Для проверки этого плагина — git-корень `ide-plugins/` или workspace `projects_work/ide-plugins/`.

## установка

```bash
./build.sh
# или: ./gradlew buildPlugin
```

Windows: `build.bat` или `gradlew.bat buildPlugin`

Установите `build/distributions/ai-chat-file-links-*.zip` через **Settings → Plugins → шестерёнка → Install from Disk**, затем **перезапустите IDE**.

При переходе с `acp-path-opener`: удалите старый плагин (`com.acp.pathopener`), затем установите новый (`com.aichat.filelinks`).

Пункты меню: **Tools → AI Chat File Links**. Если в Tools пусто — откройте проект и найдите действие через **Shift Shift** → `AI Chat` или `Open Path`.

## отладка (0.1.6+)

После клика по битой ссылке в AI Chat смотрите логи в `C:\tmp\`:

| Файл | Хук |
|------|-----|
| `ai-chat-file-links-url-opener.log` | UrlOpener (first) |
| `ai-chat-file-links-url-opener-last.log` | UrlOpener (last) — если сюда дошло, наш opener не сработал |
| `ai-chat-file-links-balloon.log` | BalloonListener |
| `ai-chat-file-links-notifications-bus.log` | Notifications.TOPIC |
| `ai-chat-file-links-notification-hyperlink.log` | клик в balloon |
| `ai-chat-file-links-capture.log` | разбор пути / буфер |
| `ai-chat-file-links-poller.log` | опрос модели уведомлений (1 раз/с) |
| `ai-chat-file-links-app-start.log` | старт плагина |
| `ai-chat-file-links-project-start.log` | открытие проекта |
| `ai-chat-file-links-project-opened.log` | ProjectManagerListener |
| `ai-chat-file-links-file-opened.log` | файл открылся в редакторе |
| `ai-chat-file-links-action-before.log` | действия в AI Chat (выборочно) |

## замечания

- Корнем проекта в PyCharm должен быть **корень репозитория** (каталог с `.git` / `build.gradle.kts` вашего приложения), а не вложенная подпапка без остальных файлов.
- Если `UrlOpener` не вызывается (в AI Chat только Compose), используйте клик в уведомлении или действие с буфером обмена.
- `sinceBuild` 243 — для более старых IDE при необходимости измените `build.gradle.kts`.

## лицензия

[MIT](../../license) — свободная лицензия (репозиторий: JetBrains и VS Code). Использование **на свой страх и риск**; см. [license](../../license) (Marketplace JetBrains, VS Code Marketplace / Open VSX). Индекс: [README_RU](../../README_RU). Сборки: [Releases](https://github.com/rufatpro/ide-plugins/releases).
