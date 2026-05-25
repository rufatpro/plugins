package com.pydoclinks

import com.intellij.openapi.util.TextRange
import com.intellij.psi.PsiElement
import com.intellij.psi.PsiFile
import com.intellij.psi.PsiManager
import com.intellij.psi.PsiReferenceBase
import com.intellij.psi.search.FilenameIndex
import com.intellij.psi.search.GlobalSearchScope

enum class SymbolKind {
    FUNC,
    CLASS,
    DATA,
    ATTR,
}

/**
 * Resolves Sphinx qualified names to def/class/module-level assignment in a Python file.
 */
class PySymbolReference(
    element: PsiElement,
    range: TextRange,
    private val qualifiedName: String,
    private val symbolKind: SymbolKind,
) : PsiReferenceBase<PsiElement>(element, range) {

    override fun resolve(): PsiElement? {
        val parts = qualifiedName.split(".")
        val symbolName = parts.last()
        if (symbolName.isBlank()) return null

        if (parts.size == 1) {
            val currentFile = element.containingFile ?: return null
            return findSymbolInFile(element.project, currentFile, symbolName)
        }

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

        val anchor = element.containingFile?.virtualFile
        for (vf in FileResolvePriority.sortByProximity(anchor, vFiles)) {
            val psiFile = PsiManager.getInstance(project).findFile(vf) ?: continue
            val hit = findSymbolInFile(project, psiFile, symbolName)
            if (hit != null) return hit
        }
        return null
    }

    override fun getVariants(): Array<Any> = emptyArray()

    private fun findSymbolInFile(project: com.intellij.openapi.project.Project, file: PsiFile, symbolName: String): PsiElement? {
        val text = file.text ?: return null
        val escaped = Regex.escape(symbolName)
        val patterns = searchPatterns(escaped)
        for (pattern in patterns) {
            val match = pattern.find(text) ?: continue
            return file.findElementAt(match.range.first)
        }
        return null
    }

    private fun searchPatterns(escaped: String): List<Regex> = when (symbolKind) {
        SymbolKind.FUNC -> listOf(
            defPattern(escaped),
            classPattern(escaped),
            assignPattern(escaped),
        )
        SymbolKind.CLASS -> listOf(
            classPattern(escaped),
            defPattern(escaped),
            assignPattern(escaped),
        )
        SymbolKind.DATA, SymbolKind.ATTR -> listOf(
            assignPattern(escaped),
            classPattern(escaped),
            defPattern(escaped),
        )
    }

    private fun defPattern(escaped: String) =
        Regex("""(?m)^\s*(?:async\s+)?def\s+$escaped\s*\(""")

    private fun classPattern(escaped: String) =
        Regex("""(?m)^\s*class\s+$escaped\s*[\(:]""")

    private fun assignPattern(escaped: String) =
        Regex("""(?m)^\s*$escaped\s*(?::[^=]+)?=""")
}
