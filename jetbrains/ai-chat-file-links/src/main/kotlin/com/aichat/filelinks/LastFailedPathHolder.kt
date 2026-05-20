package com.aichat.filelinks

object LastFailedPathHolder {
    @Volatile
    var lastPath: String? = null
}

