# Python Doc Links

[Русский](readme_ru.md) · [Releases](https://github.com/rufatpro/ide-plugins/releases) · [Repository](https://github.com/rufatpro/ide-plugins)

**JetBrains plugin** for PyCharm, IntelliJ IDEA, WebStorm, and other JetBrains IDEs.

Fixes a common limitation: Python references inside **docstrings** and **line comments** are usually plain text in PyCharm. This plugin adds Ctrl+Click navigation for supported patterns such as `submodule.py` and `:py:func:`submodule.process_submodule_data``.

> **JetBrains only** — does not install in VS Code or the Cursor desktop app.  
> Developed with AI assistance (Cursor / LLM). Part of the [ide-plugins](https://github.com/rufatpro/ide-plugins) monorepo.

## Requirements

- JetBrains IDE **2024.3+** (PyCharm, IntelliJ IDEA, WebStorm, …)
- **Python support** in the IDE: built into PyCharm; on IntelliJ IDEA / WebStorm install the **Python** plugin from the JetBrains plugin repository first
- Project opened at the **repository root** (not a nested subfolder)

## Installation

1. Download `py-doc-links-*.zip` from [GitHub Releases](https://github.com/rufatpro/ide-plugins/releases).
2. **Settings -> Plugins -> gear icon -> Install Plugin from Disk...**
3. Select the zip file and **restart** the IDE.

## Usage

Add references inside Python docstrings or comments:

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
    # see submodule.py
```

Then **Ctrl+Click** (or use Go to Declaration) on a supported reference.

## Supported patterns

| Pattern | Resolves to |
|--------|-------------|
| `filename.py` | File in project |
| `:py:func:`module.func`` | Function definition |
| `:py:func:`module.py.func`` | Function definition (tolerant filename form) |
| `:func:`module.func`` | Function definition (short form) |
| `:func:`module.py.func`` | Function definition (tolerant filename form) |
| `:func:`func`` | Function in the current module/file |
| `:py:mod:`module`` | Module file (`module.py`) |
| `:py:mod:`module.py`` | Module file (filename form) |

## How it works

The plugin registers a **PsiReferenceContributor** for Python PSI elements and builds references from text matches:

1. Scans Python string literals (docstrings) and line comments.
2. Matches supported patterns (file / Sphinx function / Sphinx module).
3. Resolves targets via project indexes (`FilenameIndex`) and PSI traversal.
4. Returns `PsiReference` so standard IDE navigation works.

## Limitations

- **Filename-based resolution**: `filename.py` resolves by file name in project scope.
- **Function resolution is heuristic**: `module.func` maps to `module.py` + `def func(...)`.
- **No rename/find-usages integration yet** for these textual references.
- **Depends on IDE PSI behavior**: future platform changes may require updates.
- See related upstream requests:
  - [YouTrack PY-13902](https://youtrack.jetbrains.com/issue/PY-13902)
  - [YouTrack PY-27635](https://youtrack.jetbrains.com/issue/PY-27635/Treat-Sphinx-Python-domain-references-in-docstrings-as-first-class-citizens)

## Building from source

### Prerequisites

- JDK 21+
- Internet connection (Gradle downloads dependencies on first run)

### Build

Windows:

```powershell
cd jetbrains\py-doc-links
build.bat
```

Artifact: `build/distributions/py-doc-links-*.zip` — install it as described above.

### Run in a sandbox IDE

```bash
./gradlew runIde     # Linux/macOS
gradlew.bat runIde   # Windows
```

Open a Python project and test Ctrl+Click on references in docstrings/comments.

### Clean

```powershell
clean.bat
```

Removes `build/`, `.gradle/`, `.intellijPlatform/`, `.kotlin/`, and log files.

### Build logs

- `log.1main.log` — Gradle output; success ends with `BUILD SUCCESSFUL`.
- `log.1err.log` — stderr from headless IDE/Gradle. Use it for compile/dependency errors.

## License

[MIT](../../license) — free to use, modify, and distribute, at your own risk.  
[ide-plugins monorepo](https://github.com/rufatpro/ide-plugins) · [Releases](https://github.com/rufatpro/ide-plugins/releases)
