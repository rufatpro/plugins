# AI Chat File Links

[English](readme.md) · [Releases](https://github.com/rufatpro/plugins/releases) · [Репозиторий](https://github.com/rufatpro/plugins)

**Плагин JetBrains** для PyCharm, IntelliJ IDEA, WebStorm и других JetBrains IDE.

Решает распространённую проблему: когда AI-агент (Cursor через ACP и другие ACP-агенты) отвечает в **AI Chat** со ссылкой на файл проекта, **клик по ней в PyCharm часто ничего не делал** — IDE писала «Cannot open a URL» или «файл не существует», хотя файл есть в корне проекта. Плагин открывает такие пути правильно.

> **Только JetBrains** — не устанавливается в VS Code и десктопный Cursor, где ссылки в чате обрабатывает сам редактор.  
> Разработан с помощью AI (Cursor / LLM). Часть монорепозитория [plugins](https://github.com/rufatpro/plugins).

## Требования

- JetBrains IDE **2024.3+** (PyCharm, IntelliJ IDEA, WebStorm, …)
- Включён плагин **AI Assistant**
- Агент **Cursor** из ACP Registry (или любой другой ACP-совместимый агент)
- Проект открыт в **корне репозитория** (не во вложенной папке)

## Установка

1. Скачайте `ai-chat-file-links-*.zip` из [GitHub Releases](https://github.com/rufatpro/plugins/releases).
2. **Settings → Plugins → ⚙ → Install Plugin from Disk…**
3. Выберите zip-файл и **перезапустите IDE**.

## Использование

1. Откройте проект в **корне репозитория**.
2. Отправьте запрос в **AI Chat** через агент **Cursor** (ACP).
3. Кликните по пути к файлу в ответе агента — файл откроется в редакторе.

Если после клика IDE показала balloon об ошибке — плагин всё равно перехватит путь, скопирует в буфер и откроет файл автоматически.

**Ручное открытие (fallback)** (**Tools → AI Chat File Links** или `Shift`+`Shift` → Find Action):

| Действие | Описание |
|----------|----------|
| **Open Last Failed Path** | Открывает последний путь, по которому появился balloon ошибки |
| **Open Path from Clipboard** | Открывает относительный путь из буфера обмена |

## Настройки

**Settings → Tools → AI Chat File Links**

| Опция | По умолчанию | Описание |
|-------|-------------|----------|
| **Dismiss error notification when the file opens successfully** | Включено | Закрывает balloon «Cannot open a URL» / «File does not exist» после успешного открытия файла. |

## Как работает

Плагин подключается к двум слоям IDE:

1. **UrlOpener (приоритет)** — перехватывает клики по ссылкам в AI Chat и пробует `project.basePath + относительный путь` до стандартного обработчика URL.
2. **Перехват уведомлений** — если шаг 1 не сработал и IDE показала balloon об ошибке, плагин извлекает путь из текста уведомления, копирует в буфер и открывает файл через `OpenFileDescriptor`.

```
Клик в AI Chat
    → UrlOpener  →  файл открыт  ✓
         ↓ (не сработал)
    IDE показывает balloon "Cannot open a URL"
    → BalloonListener / Notifications.TOPIC
    → путь → буфер обмена + OpenFileDescriptor  ✓
```

> AI Chat использует **Jewel / Compose** для рендеринга, а не стандартный гиперссылочный API — поэтому нужны кастомные хуки.

## Ограничения

- **Windows-ориентирован** — разработан и протестирован в первую очередь с разделителями путей Windows.
- **Только JetBrains** — не устанавливается в **VS Code** или десктопный **Cursor**.
- **Корень проекта важен** — пути разрешаются относительно открытого корня проекта.
- **Обходное решение** — JetBrains и Cursor могут исправить обработку ссылок нативно. Upstream-проблемы — на [JetBrains YouTrack LLM](https://youtrack.jetbrains.com/newIssue?project=LLM).

## Сборка из исходников

### Требования

- JDK 21+
- Подключение к интернету (Gradle скачает зависимости при первом запуске)

### Сборка

Linux / macOS (из корня git-репозитория):

```bash
cd jetbrains/ai-chat-file-links
chmod +x gradlew build.sh clean.sh   # один раз
./build.sh
```

Windows:

```powershell
cd jetbrains\ai-chat-file-links
build.bat
```

Артефакт: `build/distributions/ai-chat-file-links-*.zip` — устанавливается как описано выше.

### Запуск в sandbox-IDE

```bash
./gradlew runIde     # Linux/macOS
gradlew.bat runIde   # Windows
```

Откройте любой проект в его корне репозитория и проверьте клики по ссылкам в AI Chat.

### Очистка

```bash
./clean.sh    # Linux/macOS
clean.bat     # Windows
```

Удаляет `build/`, `.gradle/`, `.intellijPlatform/`, `.kotlin/` и лог-файлы.

### Логи сборки

- `log.1main.log` — вывод Gradle; успех заканчивается строкой `BUILD SUCCESSFUL`.
- `log.1err.log` — stderr headless-IDE. Строки **WARN** там обычно — шум платформы IntelliJ, не ошибки плагина. (Задача `buildSearchableOptions` отключена в `build.gradle.kts`, поэтому файл обычно пустой.)

## Отладка (опционально)

Файловое логирование в `C:\tmp\` **отключено** в релизных сборках. Чтобы включить, установите `ENABLED = true` в `DebugLog.kt`, раскомментируйте блок записи, зарегистрируйте debug-листенеры в `plugin.xml` и раскомментируйте `NotificationDebugPoller.start()` в `SubscribeFailedPathNotificationsActivity.kt`.

| Файл | Хук |
|------|-----|
| `ai-chat-file-links-url-opener.log` | UrlOpener (первый) |
| `ai-chat-file-links-url-opener-last.log` | UrlOpener (последний) — если сюда дошло, opener не сработал |
| `ai-chat-file-links-balloon.log` | BalloonListener |
| `ai-chat-file-links-notifications-bus.log` | Notifications.TOPIC |
| `ai-chat-file-links-notification-hyperlink.log` | клик в balloon |
| `ai-chat-file-links-capture.log` | разбор пути / буфер |
| `ai-chat-file-links-poller.log` | опрос модели уведомлений (1 раз/с) |
| `ai-chat-file-links-project-start.log` | ProjectActivity (открытие проекта) |
| `ai-chat-file-links-file-opened.log` | файл открылся в редакторе (debug-хук в `plugin.xml`, если включён) |
| `ai-chat-file-links-action-before.log` | действия в AI Chat (выборочно) |

## Ссылки

- [Cursor — интеграция с JetBrains](https://cursor.com/docs/integrations/jetbrains)
- [Agent Client Protocol (ACP)](https://agentclientprotocol.com/)
- [JetBrains AI Assistant — ACP](https://www.jetbrains.com/help/ai-assistant/acp.html)

## Лицензия

[MIT](../../license) — свободное использование, изменение и распространение, на свой страх и риск.  
[Монорепозиторий plugins](https://github.com/rufatpro/plugins) · [Releases](https://github.com/rufatpro/plugins/releases)

## Автор

[Руфат](https://rufat.top/)
