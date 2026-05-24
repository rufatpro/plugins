# Python Doc Links (VS Code / Cursor)

[Русский](https://github.com/rufatpro/ide-plugins/blob/main/vscode/py-doc-links/readme_ru.md) · [Releases](https://github.com/rufatpro/ide-plugins/releases) · [Repository](https://github.com/rufatpro/ide-plugins)

**VS Code / Cursor extension** that enables go-to-definition from Python docstring/comment references.

It makes references like `submodule.py`, `:py:func:`submodule.process_submodule_data``, and `:func:`run_main_flow`` navigable with Ctrl+Click (or F12).

> Developed with AI assistance (Cursor / LLM). Part of the [ide-plugins](https://github.com/rufatpro/ide-plugins) monorepo.

## Supported patterns

| Pattern | Resolves to |
|--------|-------------|
| `filename.py` | File in workspace |
| `:py:func:`module.func`` | Function definition |
| `:py:func:`module.py.func`` | Function definition (tolerant filename form) |
| `:func:`module.func`` | Function definition |
| `:func:`module.py.func`` | Function definition (tolerant filename form) |
| `:func:`func`` | Function in the current file |
| `:py:mod:`module`` | Module file (`module.py`) |
| `:py:mod:`module.py`` | Module file (filename form) |

## Example

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

## Install (persistent, via VSIX)

Build the VSIX package:

```bash
npm install -g @vscode/vsce
cd vscode/py-doc-links
build.bat
```

Then install the generated `.vsix`.

**Command Palette (primary method, VS Code and Cursor):**

1. Open Command Palette: **F1**, **Ctrl+Shift+P** (Windows/Linux), **Cmd+Shift+P** (macOS), or **View → Command Palette**
2. Type: `Install from VSIX`
3. Select **Extensions: Install from VSIX...**
4. Pick the `.vsix` file (see path below)

Resulting package file:

`vscode/py-doc-links/build/py-doc-links-0.2.4.vsix`

## Limitations

- Function lookup is heuristic (`module.func` -> `module.py` + `def func(...)`).
- If multiple files share the same basename, first match in workspace is used.
- No rename/find-usages integration for these textual references.
- Works only in Python files (`language: python`).

Related upstream context:
- [YouTrack PY-13902](https://youtrack.jetbrains.com/issue/PY-13902)
- [YouTrack PY-27635](https://youtrack.jetbrains.com/issue/PY-27635/Treat-Sphinx-Python-domain-references-in-docstrings-as-first-class-citizens)

## License

[MIT](https://github.com/rufatpro/ide-plugins/blob/main/license) — free to use, modify, and distribute, at your own risk.  
[ide-plugins monorepo](https://github.com/rufatpro/ide-plugins) · [Releases](https://github.com/rufatpro/ide-plugins/releases)

## Author

[Rufat](https://rufat.top/)
