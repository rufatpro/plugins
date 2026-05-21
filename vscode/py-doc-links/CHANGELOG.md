# Changelog

## 0.2.2

- Fixed README links for VS Code Marketplace (absolute GitHub URLs, `vsce.baseContentUrl` for monorepo).

## 0.2.1

- Fixed VS Code Marketplace publisher ID: `rufat` (was `rufatpro`).

## 0.2.0

- Added tolerant parsing/resolve for `:py:func:`module.py.func`` and `:func:`module.py.func``.
- Added support for `:func:`func`` in the current file.
- Improved matcher priority so Sphinx references win over plain `filename.py` overlaps.
- Updated examples and docs to use `main.py` / `submodule.py`.

## 0.1.0

- Initial release.
- Added go-to-definition for Python docstring/comment references:
  - `filename.py`
  - `:py:func:`module.func``
  - `:py:func:`module.py.func`` (tolerant)
  - `:func:`module.func``
  - `:func:`module.py.func`` (tolerant)
  - `:func:`func`` (current file)
  - `:py:mod:`module`` / `:py:mod:`module.py``
