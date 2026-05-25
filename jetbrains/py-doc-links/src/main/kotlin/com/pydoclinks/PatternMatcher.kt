package com.pydoclinks

import com.intellij.openapi.util.TextRange

data class DocMatch(
    val type: MatchType,
    /** The resolved target: filename.py or module.func */
    val qualifiedName: String,
    /** Range within the full element text (including quotes for string literals) */
    val rangeInElement: TextRange,
)

enum class MatchType { FILE, SPHINX_FUNC, SPHINX_CLASS, SPHINX_DATA, SPHINX_ATTR, SPHINX_MOD }

object PatternMatcher {

    // filename.py — must start/end at word boundary
    private val FILE_RE = Regex("""(?<!\w)(\w[\w\-]*\.py)(?!\w)""")

    // :py:func:`module.func` or :py:func:`pkg.module.func`
    private val SPHINX_FUNC_FULL = Regex(""":py:func:`(\w[\w]*(?:\.\w[\w]*)+)`""")

    // :func:`module.func` or :func:`func` (short form, current file)
    private val SPHINX_FUNC_SHORT = Regex(""":func:`(\w[\w]*(?:\.\w[\w]*)*)`""")

    private val SPHINX_CLASS_FULL = Regex(""":py:class:`(\w[\w]*(?:\.\w[\w]*)*)`""")
    private val SPHINX_CLASS_SHORT = Regex(""":class:`(\w[\w]*(?:\.\w[\w]*)*)`""")

    private val SPHINX_DATA_FULL = Regex(""":py:data:`(\w[\w]*(?:\.\w[\w]*)*)`""")
    private val SPHINX_DATA_SHORT = Regex(""":data:`(\w[\w]*(?:\.\w[\w]*)*)`""")

    private val SPHINX_ATTR_FULL = Regex(""":py:attr:`(\w[\w]*(?:\.\w[\w]*)*)`""")
    private val SPHINX_ATTR_SHORT = Regex(""":attr:`(\w[\w]*(?:\.\w[\w]*)*)`""")

    // :py:mod:`module` or :py:mod:`pkg.module`
    private val SPHINX_MOD = Regex(""":py:mod:`(\w[\w]*(?:\.\w[\w]*)*)`""")

    fun findMatches(text: String, startOffset: Int = 0): List<DocMatch> {
        val result = mutableListOf<DocMatch>()

        fun addSphinx(type: MatchType, regex: Regex) {
            regex.findAll(text, startOffset).forEach { m ->
                val g = m.groups[1]!!
                result += DocMatch(
                    type = type,
                    qualifiedName = g.value,
                    rangeInElement = TextRange(g.range.first, g.range.last + 1),
                )
            }
        }

        addSphinx(MatchType.SPHINX_FUNC, SPHINX_FUNC_FULL)
        addSphinx(MatchType.SPHINX_FUNC, SPHINX_FUNC_SHORT)
        addSphinx(MatchType.SPHINX_CLASS, SPHINX_CLASS_FULL)
        addSphinx(MatchType.SPHINX_CLASS, SPHINX_CLASS_SHORT)
        addSphinx(MatchType.SPHINX_DATA, SPHINX_DATA_FULL)
        addSphinx(MatchType.SPHINX_DATA, SPHINX_DATA_SHORT)
        addSphinx(MatchType.SPHINX_ATTR, SPHINX_ATTR_FULL)
        addSphinx(MatchType.SPHINX_ATTR, SPHINX_ATTR_SHORT)

        SPHINX_MOD.findAll(text, startOffset).forEach { m ->
            val g = m.groups[1]!!
            result += DocMatch(
                type = MatchType.SPHINX_MOD,
                qualifiedName = g.value,
                rangeInElement = TextRange(g.range.first, g.range.last + 1),
            )
        }

        FILE_RE.findAll(text, startOffset).forEach { m ->
            val g = m.groups[1]!!
            result += DocMatch(
                type = MatchType.FILE,
                qualifiedName = g.value,
                rangeInElement = TextRange(g.range.first, g.range.last + 1),
            )
        }

        // Remove overlapping ranges — keep first occurrence
        return result
            .sortedBy { it.rangeInElement.startOffset }
            .fold(mutableListOf()) { acc, match ->
                if (acc.isEmpty() || !acc.last().rangeInElement.intersects(match.rangeInElement)) {
                    acc += match
                }
                acc
            }
    }
}
