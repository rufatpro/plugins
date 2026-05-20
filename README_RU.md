# ide-plugins

**Русский** · [README](README.md) (English)

**Репозиторий:** [github.com/rufatpro/ide-plugins](https://github.com/rufatpro/ide-plugins)

Плагины и расширения для IDE. Платформы — в подкаталогах:

| Платформа | Каталог | Среда |
|-----------|---------|--------|
| **JetBrains** | [JetBrains](jetbrains/) (`jetbrains/`) | PyCharm, IntelliJ IDEA, WebStorm, … — плагины IntelliJ Platform |
| **VS Code** | [VS Code](vscode/) (`vscode/`, планируется) | Visual Studio Code и совместимые редакторы — расширения (Extension API) |

Сейчас в репозитории есть плагин для **JetBrains**; расширения для **VS Code** будут добавляться в `vscode/<имя>/` по той же схеме (`readme.md`, сборка, лицензия MIT из корня).

**Корень git-репозитория** — этот каталог (`README.md`, `README_RU.md`, `license`, JetBrains/… в `jetbrains/`; `git init` здесь). Сборка:

```bash
cd jetbrains/ai-chat-file-links
./build.sh
```

**Workspace шире репозитория** (родитель с `chat-specstory-history/`): тот же плагин — `cd ide-plugins/jetbrains/ai-chat-file-links` (или `ide-plugins\jetbrains\ai-chat-file-links` на Windows).

**Имена файлов:** документация и лицензия в нижнем регистре — `readme.md`, `readme_ru.md`, `license` (не `LICENSE` в каталогах плагинов).

**Лицензия:** [MIT](license) — свободное использование, изменение и распространение (JetBrains и VS Code).  
**Важно:** всё ПО здесь предоставляется «как есть», **на свой страх и риск**; авторы не несут ответственности за сбои IDE/редактора, потерю данных и т.п. Подробности — в [license](license) (в т.ч. JetBrains Marketplace и VS Code Marketplace / Open VSX).

---

## Каталог плагинов

| Плагин | Платформа | ID | Версия | Описание | Документация |
|--------|-----------|-----|--------|----------|--------------|
| [AI Chat File Links](jetbrains/ai-chat-file-links/) | JetBrains (PyCharm, IDEA, …) | `com.aichat.filelinks` | 0.2.0 | Открывает файлы по ссылкам из **AI Chat** при ошибках URL/«файл не существует»; настройка **Dismiss error notification when the file opens successfully** (Settings → Tools → AI Chat File Links) закрывает balloon после открытия | [readme.md](jetbrains/ai-chat-file-links/readme.md) · [readme_ru.md](jetbrains/ai-chat-file-links/readme_ru.md) |

---

## JetBrains

### [AI Chat File Links](jetbrains/ai-chat-file-links/)

**Назначение:** обходной путь для битых ссылок на файлы в **JetBrains AI Chat** при работе с агентом **Cursor** (и другими через [ACP](https://agentclientprotocol.com/)) — в первую очередь на **Windows**. Разработан **с помощью AI** (Cursor / LLM).

**Проблема:** в ответе агента есть относительный путь (например `src/app/settings.py` или `docs/readme.md`), файл есть под корнем проекта, но по клику IDE не открывает его (ошибка URL или «файл не существует»).

**Решение:**

- перехват клика (`UrlOpener`) — путь как `корень проекта + относительный путь`;
- перехват уведомления об ошибке — извлечение пути, копирование в буфер, открытие в редакторе;
- меню **Tools → AI Chat File Links** — ручное открытие из буфера или последнего сбойного пути.
- **Settings → Tools → AI Chat File Links** — опция закрытия уведомления об ошибке после успешного открытия файла (по умолчанию включена).

**Требования:** IDE 2024.3+ (`sinceBuild` 243), включён **AI Assistant**, агент Cursor (ACP), проект открыт в **корне репозитория**.

**Файлы в каталоге плагина:**

| Файл | Назначение |
|------|------------|
| [readme.md](jetbrains/ai-chat-file-links/readme.md) | документация (EN) |
| [readme_ru.md](jetbrains/ai-chat-file-links/readme_ru.md) | документация (RU) |
| `build.sh` / `build.bat` | сборка zip |
| `clean.sh` / `clean.bat` | очистка `build/`, кэшей |
| `gradlew` / `gradlew.bat` | Gradle Wrapper |

**Сборка** (из корня git-репозитория):

```bash
cd jetbrains/ai-chat-file-links
chmod +x gradlew build.sh clean.sh   # Linux/macOS, один раз
./build.sh
```

Windows:

```powershell
cd jetbrains\ai-chat-file-links
.\build.bat
```

Артефакт: `build/distributions/ai-chat-file-links-*.zip`.

---

## VS Code

Расширения для **Visual Studio Code** (и форков вроде VSCodium) размещаются в `vscode/<имя>/` (TypeScript/JavaScript, `package.json`, `.vsix`). Публикация — [Visual Studio Marketplace](https://marketplace.visualstudio.com/) и/или [Open VSX](https://open-vsx.org/).

Аналог сценария «битые ссылки на файлы из чата агента» для VS Code/Cursor в этом репозитории пока **не реализован**; при появлении расширения строка появится в таблице каталога и здесь будет блок с путём сборки.

---

## Структура (для новых плагинов)

```text
<корень git ide-plugins/>/
  README.md              # индекс (EN)
  README_RU.md           # индекс (RU)
  license                # MIT + disclaimer
  .gitignore             # **/build/, **/.gradle/, …
  jetbrains/             # JetBrains — IntelliJ Platform (.zip)
    <plugin-name>/
      build.gradle.kts
      src/
  vscode/                # VS Code — Extension (.vsix), когда появится
    <extension-name>/
      package.json
      src/
  <platform>/<name>/
      readme.md          # EN (основной)
      readme_ru.md       # RU (опционально)
      build.sh / build.bat   # JetBrains
      clean.sh / clean.bat
```

При добавлении плагина: строка в таблицу, блок в разделе платформы, ссылки на `readme.md` / `readme_ru.md`.
