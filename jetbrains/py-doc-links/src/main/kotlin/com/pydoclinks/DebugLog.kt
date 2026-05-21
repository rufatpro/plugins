package com.pydoclinks

// import java.io.PrintWriter
// import java.io.StringWriter
// import java.nio.file.Files
// import java.nio.file.Path
// import java.nio.file.StandardOpenOption
// import java.time.Instant

object DebugLog {

    /** Set to true to write hook logs under C:\tmp\py-doc-links-*.log */
    private const val ENABLED = false

    // private val dir: Path = Path.of("C:\\tmp")

    fun log(hook: String, message: String, throwable: Throwable? = null) {
        if (!ENABLED) return
        /*
        try {
            Files.createDirectories(dir)
            val file = dir.resolve("py-doc-links-$hook.log")
            val body = buildString {
                append(Instant.now())
                append(" | ")
                append(message)
                append('\n')
                if (throwable != null) {
                    val sw = StringWriter()
                    throwable.printStackTrace(PrintWriter(sw))
                    append(sw)
                    if (!sw.toString().endsWith("\n")) append('\n')
                }
            }
            Files.writeString(
                file,
                body,
                StandardOpenOption.CREATE,
                StandardOpenOption.APPEND,
            )
        } catch (t: Throwable) {
            System.err.println("Python Doc Links debug log failed [$hook]: $message (${t.message})")
        }
        */
    }
}
