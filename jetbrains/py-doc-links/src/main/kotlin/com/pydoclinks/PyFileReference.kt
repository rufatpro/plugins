package com.pydoclinks

import com.intellij.openapi.util.TextRange
import com.intellij.psi.PsiElement
import com.intellij.psi.PsiManager
import com.intellij.psi.PsiReferenceBase
import com.intellij.psi.search.FilenameIndex
import com.intellij.psi.search.GlobalSearchScope

/**
 * Reference to a .py file found by filename anywhere in the project.
 * Used for patterns like `submodule.py` in docstrings / comments.
 */
class PyFileReference(
    element: PsiElement,
    range: TextRange,
    private val fileName: String,
) : PsiReferenceBase<PsiElement>(element, range) {

    override fun resolve(): PsiElement? {
        val project = element.project
        val vFiles = FilenameIndex.getVirtualFilesByName(
            fileName,
            GlobalSearchScope.projectScope(project),
        )
        val anchor = element.containingFile?.virtualFile
        val best = FileResolvePriority.best(anchor, vFiles) ?: return null
        return PsiManager.getInstance(project).findFile(best)
    }

    override fun getVariants(): Array<Any> = emptyArray()
}
