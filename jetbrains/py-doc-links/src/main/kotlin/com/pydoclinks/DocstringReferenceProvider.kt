package com.pydoclinks

import com.intellij.psi.PsiComment
import com.intellij.psi.PsiElement
import com.intellij.psi.PsiLanguageInjectionHost
import com.intellij.psi.PsiReference
import com.intellij.psi.PsiReferenceProvider
import com.intellij.util.ProcessingContext

/**
 * Scans the text of Python string literals (docstrings) and line comments
 * for file/function reference patterns and returns [PsiReference] objects
 * for each match so that Ctrl+Click navigates to the target.
 */
class DocstringReferenceProvider : PsiReferenceProvider() {

    override fun getReferencesByElement(
        element: PsiElement,
        context: ProcessingContext,
    ): Array<PsiReference> {
        if (!element.language.id.equals("Python", ignoreCase = true)) {
            return emptyArray()
        }

        val text = element.text

        // For string literals the text includes surrounding quotes — skip them
        // so that patterns starting at quote position are not matched.
        val contentStart = when (element) {
            is PsiLanguageInjectionHost -> when {
                text.startsWith("\"\"\"") || text.startsWith("'''") -> 3
                text.startsWith("r\"\"\"") || text.startsWith("r'''") -> 4
                text.startsWith("\"") || text.startsWith("'") -> 1
                else -> 0
            }
            is PsiComment -> 1  // skip the leading '#'
            else -> 0
        }

        return PatternMatcher.findMatches(text, contentStart).map { match ->
            when (match.type) {
                MatchType.FILE ->
                    PyFileReference(element, match.rangeInElement, match.qualifiedName)

                MatchType.SPHINX_FUNC ->
                    PySymbolReference(element, match.rangeInElement, match.qualifiedName, SymbolKind.FUNC)

                MatchType.SPHINX_CLASS ->
                    PySymbolReference(element, match.rangeInElement, match.qualifiedName, SymbolKind.CLASS)

                MatchType.SPHINX_DATA ->
                    PySymbolReference(element, match.rangeInElement, match.qualifiedName, SymbolKind.DATA)

                MatchType.SPHINX_ATTR ->
                    PySymbolReference(element, match.rangeInElement, match.qualifiedName, SymbolKind.ATTR)

                MatchType.SPHINX_MOD -> {
                    // Support both:
                    // - :py:mod:`pkg.module` -> module.py
                    // - :py:mod:`module.py`  -> module.py
                    val moduleRef = match.qualifiedName
                    val fileName = if (moduleRef.endsWith(".py", ignoreCase = true)) {
                        moduleRef
                    } else {
                        "${moduleRef.substringAfterLast('.')}.py"
                    }
                    PyFileReference(element, match.rangeInElement, fileName)
                }
            }
        }.toTypedArray()
    }
}
