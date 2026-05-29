# Python Doc Links

[English](readme.md) · [Releases](https://github.com/rufatpro/plugins/releases) · [Репозиторий](https://github.com/rufatpro/plugins)

**Плагин JetBrains** для PyCharm, IntelliJ IDEA, WebStorm и других JetBrains IDE.

Решает распространённое ограничение: ссылки на Python-файлы и функции внутри **docstring** и **комментариев** обычно остаются обычным текстом. Плагин добавляет Ctrl+Click-навигацию для поддерживаемых паттернов, например `submodule.py` и <code>:py:func:`submodule.process_submodule_data`</code>.

> **Только JetBrains** — не устанавливается в VS Code и десктопный Cursor.  
> Разработан с помощью AI (Cursor / LLM). Часть монорепозитория [plugins](https://github.com/rufatpro/plugins).

## Требования

- JetBrains IDE **2024.3+** (PyCharm, IntelliJ IDEA, WebStorm, …)
- **Поддержка Python** в IDE: в PyCharm уже есть; в IntelliJ IDEA / WebStorm сначала установите плагин **Python** из репозитория JetBrains
- Проект открыт в **корне репозитория** (не во вложенной папке)

## Установка

1. Скачайте `py-doc-links-*.zip` из [GitHub Releases](https://github.com/rufatpro/plugins/releases).
2. **Settings -> Plugins -> значок шестерёнки -> Install Plugin from Disk...**
3. Выберите zip-файл и **перезапустите IDE**.

## Использование

Добавьте ссылки в Python docstring или комментарии:

```python
def example():
    """
    File: submodule.py
    Function: :py:func:`submodule.process_submodule_data`
    Function (filename form): :py:func:`submodule.py.process_submodule_data`
    Function (current module): :func:`run_main_flow`
    Variable: :py:data:`config.hosters_data`
    Class: :py:class:`ObjectWithProperties`
    Module: :py:mod:`submodule`
    Module (filename form): :py:mod:`submodule.py`
    """
    # see submodule.py
```

Далее используйте **Ctrl+Click** (или Go to Declaration) по поддерживаемой ссылке.

## Поддерживаемые паттерны

| Паттерн | Переход к |
|--------|-----------|
| `filename.py` | Файл в проекте |
| <code>:py:func:`module.func`</code> | Определение функции |
| <code>:py:func:`module.py.func`</code> | Определение функции (толерантная форма с именем файла) |
| <code>:func:`module.func`</code> | Определение функции (короткая форма) |
| <code>:func:`module.py.func`</code> | Определение функции (толерантная форма с именем файла) |
| <code>:func:`func`</code> | Функция в текущем модуле/файле |
| <code>:py:class:`module.Class`</code> | Определение класса |
| <code>:class:`Class`</code> | Класс в текущем файле |
| <code>:py:data:`module.var`</code> | Переменная модуля |
| <code>:py:func:`module.name`</code> | Если нет `def`, ищет class и присваивание |
| <code>:py:mod:`module`</code> | Файл модуля (`module.py`) |
| <code>:py:mod:`module.py`</code> | Файл модуля (форма с именем файла) |

## Как работает

Плагин регистрирует **PsiReferenceContributor** для Python PSI-элементов и создаёт ссылки из текстовых совпадений:

1. Сканирует Python string literals (docstring) и line comments.
2. Находит поддерживаемые паттерны (файл / Sphinx function, class, data, module).
3. Разрешает цель через индексы проекта (`FilenameIndex`) и обход PSI.
4. Возвращает `PsiReference`, после чего работает стандартная навигация IDE.

## Ограничения

- **Разрешение по имени файла**: `filename.py` ищется по имени в project scope; файл в той же папке, что и исходник, предпочтительнее дубликатов в `docs/` и похожих каталогах.
- **Разрешение функций эвристическое**: `module.func` сопоставляется как `module.py` + `def func(...)`.
- Пока нет полноценной интеграции с **rename/find usages** для таких текстовых ссылок.
- Поведение зависит от PSI платформы IDE; при обновлениях JetBrains могут потребоваться правки.
- Связанные upstream-запросы:
  - [YouTrack PY-13902](https://youtrack.jetbrains.com/issue/PY-13902)
  - [YouTrack PY-27635](https://youtrack.jetbrains.com/issue/PY-27635/Treat-Sphinx-Python-domain-references-in-docstrings-as-first-class-citizens)

## Сборка из исходников

### Требования

- JDK 21+
- Интернет (при первом запуске Gradle скачает зависимости)

### Сборка

Windows:

```powershell
cd jetbrains\py-doc-links
build.bat
```

Артефакт: `build/distributions/py-doc-links-*.zip` — устанавливается как описано выше.

### Запуск в sandbox-IDE

```bash
./gradlew runIde     # Linux/macOS
gradlew.bat runIde   # Windows
```

Откройте Python-проект и проверьте Ctrl+Click по ссылкам в docstring/комментариях.

### Очистка

```powershell
clean.bat
```

Удаляет `build/`, `.gradle/`, `.intellijPlatform/`, `.kotlin/` и log-файлы.

### Логи сборки

- `log.1main.log` — вывод Gradle; успешная сборка заканчивается `BUILD SUCCESSFUL`.
- `log.1err.log` — stderr headless-IDE/Gradle; используйте для анализа ошибок компиляции и зависимостей.

## Лицензия

[MIT](../../license) — свободное использование, изменение и распространение, на ваш риск.  
[Монорепозиторий plugins](https://github.com/rufatpro/plugins) · [Releases](https://github.com/rufatpro/plugins/releases)

## Автор

[Руфат](https://rufat.top/)
