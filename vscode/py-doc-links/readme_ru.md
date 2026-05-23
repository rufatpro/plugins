# Python Doc Links (VS Code / Cursor)

[English](https://github.com/rufatpro/ide-plugins/blob/main/vscode/py-doc-links/readme.md) · [Releases](https://github.com/rufatpro/ide-plugins/releases) · [Репозиторий](https://github.com/rufatpro/ide-plugins)

**Расширение VS Code / Cursor**, которое добавляет переход к определению из ссылок в Python docstring/комментариях.

Делает навигацию по `submodule.py`, `:py:func:`submodule.process_submodule_data``, `:func:`run_main_flow`` через Ctrl+Click (или F12).

> Разработано с помощью AI (Cursor / LLM). Часть монорепозитория [ide-plugins](https://github.com/rufatpro/ide-plugins).

## Поддерживаемые паттерны

| Паттерн | Переход к |
|--------|-----------|
| `filename.py` | Файл в workspace |
| `:py:func:`module.func`` | Определение функции |
| `:py:func:`module.py.func`` | Определение функции (толерантная форма с именем файла) |
| `:func:`module.func`` | Определение функции |
| `:func:`module.py.func`` | Определение функции (толерантная форма с именем файла) |
| `:func:`func`` | Функция в текущем файле |
| `:py:mod:`module`` | Файл модуля (`module.py`) |
| `:py:mod:`module.py`` | Файл модуля (форма с именем файла) |

## Пример

```python
def example():
    """
    File: submodule.py
    Function: :py:func:`submodule.process_submodule_data`
    Function (filename form): :py:func:`submodule.py.process_submodule_data`
    Function (current module): :func:`run_main_flow`
    Module: :py:mod:`submodule`
    Module (filename form): :py:mod:`submodule.py`
    """
```

## Установка (постоянная, через VSIX)

Соберите пакет `.vsix`:

```bash
npm install -g @vscode/vsce
cd vscode/py-doc-links
build.bat
```

Далее установите сгенерированный `.vsix`.

**Command Palette (основной способ, VS Code и Cursor):**

1. Откройте Command Palette: **F1**, **Ctrl+Shift+P** (Windows/Linux), **Cmd+Shift+P** (macOS) или **View → Command Palette**
2. Введите: `Install from VSIX`
3. Выберите **Extensions: Install from VSIX...**
4. Укажите файл `.vsix` (см. путь ниже)

Итоговый файл пакета:

`vscode/py-doc-links/build/py-doc-links-0.2.3.vsix`

## Ограничения

- Поиск функций эвристический (`module.func` -> `module.py` + `def func(...)`).
- Если в workspace несколько файлов с одинаковым именем, берётся первый найденный.
- Нет интеграции rename/find-usages для таких текстовых ссылок.
- Работает только в Python-файлах (`language: python`).

Связанные upstream issue:
- [YouTrack PY-13902](https://youtrack.jetbrains.com/issue/PY-13902)
- [YouTrack PY-27635](https://youtrack.jetbrains.com/issue/PY-27635/Treat-Sphinx-Python-domain-references-in-docstrings-as-first-class-citizens)

## Лицензия

[MIT](https://github.com/rufatpro/ide-plugins/blob/main/license) — свободное использование, изменение и распространение, на ваш риск.  
[Монорепозиторий ide-plugins](https://github.com/rufatpro/ide-plugins) · [Releases](https://github.com/rufatpro/ide-plugins/releases)

## Автор

[Руфат Нуриев](https://rufat.top/)
