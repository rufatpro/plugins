package com.aichat.filelinks

import com.intellij.ide.browsers.UrlOpener
import com.intellij.ide.browsers.WebBrowser
import com.intellij.openapi.project.Project

/**
 * Debug: runs after other UrlOpeners — logs if we were not first to handle the URL.
 */
class DebugUrlOpenerLast : UrlOpener() {

    override fun openUrl(browser: WebBrowser, url: String, project: Project?): Boolean {
        DebugLog.log(
            "url-opener-last",
            "openUrl called (not handled earlier?) url=[$url] project=${project?.name} browser=${browser.javaClass.name}",
        )
        return false
    }
}

