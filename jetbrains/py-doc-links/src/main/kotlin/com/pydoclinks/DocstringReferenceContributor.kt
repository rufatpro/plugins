package com.pydoclinks

import com.intellij.patterns.PlatformPatterns
import com.intellij.psi.PsiComment
import com.intellij.psi.PsiLanguageInjectionHost
import com.intellij.psi.PsiReferenceContributor
import com.intellij.psi.PsiReferenceRegistrar

/**
 * Registers [DocstringReferenceProvider] for:
 *  - Python string literals (covers docstrings)
 *  - Python line comments
 */
class DocstringReferenceContributor : PsiReferenceContributor() {

    override fun registerReferenceProviders(registrar: PsiReferenceRegistrar) {
        val provider = DocstringReferenceProvider()

        registrar.registerReferenceProvider(
            PlatformPatterns.psiElement(PsiLanguageInjectionHost::class.java),
            provider,
            PsiReferenceRegistrar.LOWER_PRIORITY,
        )

        registrar.registerReferenceProvider(
            PlatformPatterns.psiElement(PsiComment::class.java),
            provider,
            PsiReferenceRegistrar.LOWER_PRIORITY,
        )
    }
}
