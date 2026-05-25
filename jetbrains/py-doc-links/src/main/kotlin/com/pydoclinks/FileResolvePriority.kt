package com.pydoclinks

import com.intellij.openapi.vfs.VirtualFile
import java.io.File

/**
 * Ranks duplicate filenames (e.g. many `main.py` in a monorepo) so navigation
 * prefers the module next to the source file, not unrelated docs/examples copies.
 */
object FileResolvePriority {
    private val DEPRIORITIZED_SEGMENTS = listOf(
        "/docs/",
        "\\docs\\",
        "/!to_tg/",
        "\\!to_tg\\",
        "/examples/",
        "\\examples\\",
    )

    fun sortByProximity(anchorFile: VirtualFile?, candidates: Collection<VirtualFile>): List<VirtualFile> {
        if (candidates.isEmpty()) return emptyList()
        if (anchorFile == null) return candidates.toList()
        val anchorDir = anchorFile.parent?.path ?: anchorFile.path
        return candidates.sortedByDescending { score(anchorDir, it.path) }
    }

    fun best(anchorFile: VirtualFile?, candidates: Collection<VirtualFile>): VirtualFile? =
        sortByProximity(anchorFile, candidates).firstOrNull()

    private fun score(anchorDir: String, candidatePath: String): Int {
        val anchor = normalize(anchorDir)
        val candidate = normalize(candidatePath)
        val candidateDir = normalize(File(candidatePath).parent ?: candidatePath)

        var score = 0

        if (candidateDir == anchor) {
            score += 10_000
        }

        if (candidate.startsWith("$anchor/")) {
            score += 1_000
        }

        for (segment in DEPRIORITIZED_SEGMENTS) {
            if (candidate.contains(normalize(segment))) {
                score -= 2_000
            }
        }

        score += commonPrefixLength(anchor, candidateDir)

        val rel = File(anchorDir).toPath().relativize(File(candidateDir).toPath()).toString()
        val hops = rel.split('/', '\\').count { it.isNotEmpty() && it != "." && it != ".." }
        score -= hops * 50

        return score
    }

    private fun normalize(path: String): String = path.replace('\\', '/').lowercase()

    private fun commonPrefixLength(a: String, b: String): Int {
        val limit = minOf(a.length, b.length)
        var i = 0
        while (i < limit && a[i] == b[i]) {
            i++
        }
        return i
    }
}
