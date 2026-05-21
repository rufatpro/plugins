# Python Doc Links

[English](readme.md) · [Releases](https://github.com/rufatpro/ide-plugins/releases) · [Репозиторий](https://github.com/rufatpro/ide-plugins)

**Плагин JetBrains** для PyCharm, IntelliJ IDEA, WebStorm и других JetBrains IDE.

Решает распространённое ограничение: ссылки на Python-файлы и функции внутри **docstring** и **комментариев** обычно остаются обычным текстом. Плагин добавляет Ctrl+Click-навигацию для поддерживаемых паттернов, например `tmp2.py` и `:py:func:`tmp2.tmp_func``.

> **Только JetBrains** — не устанавливается в VS Code и десктопный Cursor.  
> Разработан с помощью AI (Cursor / LLM). Часть монорепозитория [ide-plugins](https://github.com/rufatpro/ide-plugins).

## Требования

- JetBrains IDE **2024.3+** (PyCharm, IntelliJ IDEA, WebStorm, ...)
- В IDE должен быть включён Python-плагин (`com.intellij.modules.python`)
- Проект открыт в **корне репозитория** (не во вложенной папке)

## Установка

1. Скачайте `py-doc-links-*.zip` из [GitHub Releases](https://github.com/rufatpro/ide-plugins/releases).
2. **Settings -> Plugins -> значок шестерёнки -> Install Plugin from Disk...**
3. Выберите zip-файл и **перезапустите IDE**.

## Использование

Добавьте ссылки в Python docstring или комментарии:

```python
def example():
    """
    File: tmp2.py
    Function: :py:func:`tmp2.tmp_func`
    Function (filename form): :py:func:`tmp2.py.tmp_func`
    Function (current module): :func:`tmp`
    Module: :py:mod:`tmp2`
    Module (filename form): :py:mod:`tmp2.py`
    """
    # see tmp2.py
```

Далее используйте **Ctrl+Click** (или Go to Declaration) по поддерживаемой ссылке.

## Поддерживаемые паттерны

| Паттерн | Переход к |
|--------|-----------|
| `filename.py` | Файл в проекте |
| `:py:func:`module.func`` | Определение функции |
| `:py:func:`module.py.func`` | Определение функции (толерантная форма с именем файла) |
| `:func:`module.func`` | Определение функции (короткая форма) |
| `:func:`module.py.func`` | Определение функции (толерантная форма с именем файла) |
| `:func:`func`` | Функция в текущем модуле/файле |
| `:py:mod:`module`` | Файл модуля (`module.py`) |
| `:py:mod:`module.py`` | Файл модуля (форма с именем файла) |

## Как работает

Плагин регистрирует **PsiReferenceContributor** для Python PSI-элементов и создаёт ссылки из текстовых совпадений:

1. Сканирует Python string literals (docstring) и line comments.
2. Находит поддерживаемые паттерны (файл / Sphinx function / Sphinx module).
3. Разрешает цель через индексы проекта (`FilenameIndex`) и обход PSI.
4. Возвращает `PsiReference`, после чего работает стандартная навигация IDE.

## Ограничения

- **Разрешение по имени файла**: `filename.py` ищется по имени файла в рамках project scope.
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
[Монорепозиторий ide-plugins](https://github.com/rufatpro/ide-plugins) · [Releases](https://github.com/rufatpro/ide-plugins/releases)
