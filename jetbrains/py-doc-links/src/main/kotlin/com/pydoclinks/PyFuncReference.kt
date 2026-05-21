package com.pydoclinks

import com.intellij.openapi.util.TextRange
import com.intellij.psi.PsiElement
import com.intellij.psi.PsiManager
import com.intellij.psi.PsiNamedElement
import com.intellij.psi.PsiReferenceBase
import com.intellij.psi.search.FilenameIndex
import com.intellij.psi.search.GlobalSearchScope
import com.intellij.psi.util.PsiTreeUtil

/**
 * Reference to a Python function resolved by qualified name `module.func`
 * or `pkg.module.func` (uses the last component before the function as filename).
 *
 * Used for Sphinx patterns like `:py:func:`tmp2.tmp_func``.
 */
class PyFuncReference(
    element: PsiElement,
    range: TextRange,
    /** e.g. "tmp2.tmp_func" or "pkg.module.func" */
    private val qualifiedName: String,
) : PsiReferenceBase<PsiElement>(element, range) {

    override fun resolve(): PsiElement? {
        val parts = qualifiedName.split(".")
        val funcName = parts.last()
        if (funcName.isBlank()) return null

        // Support :func:`tmp` — resolve inside current file first.
        if (parts.size == 1) {
            val currentFile = element.containingFile ?: return null
            return findFunctionInFile(currentFile, funcName)
        }

        // Standard form: module.func
        // Tolerant form: module.py.func  -> treat as module.func
        val moduleFilePart = when {
            parts.size >= 3 && parts[parts.size - 2].equals("py", ignoreCase = true) -> parts[parts.size - 3]
            else -> parts[parts.size - 2]
        }
        val fileName = "$moduleFilePart.py"

        val project = element.project
        val vFiles = FilenameIndex.getVirtualFilesByName(
            fileName,
            GlobalSearchScope.projectScope(project),
        )

        for (vf in vFiles) {
            val psiFile = PsiManager.getInstance(project).findFile(vf) ?: continue
            val func = findFunctionInFile(psiFile, funcName)
            if (func != null) return func
        }
        return null
    }

    override fun getVariants(): Array<Any> = emptyArray()

    private fun findFunctionInFile(file: PsiElement, funcName: String): PsiElement? {
        val candidates = PsiTreeUtil.findChildrenOfType(file, PsiNamedElement::class.java)
        return candidates.firstOrNull { named ->
            named.name == funcName && named.text.startsWith("def ")
        } ?: candidates.firstOrNull { named ->
            named.name == funcName
        }
    }
}
