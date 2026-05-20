package com.aichat.filelinks

import com.intellij.ide.browsers.UrlOpener
import com.intellij.ide.browsers.WebBrowser
import com.intellij.openapi.project.Project
import com.intellij.openapi.project.ProjectManager

class ProjectRelativePathUrlOpener : UrlOpener() {

    override fun openUrl(browser: WebBrowser, url: String, project: Project?): Boolean {
        DebugLog.log(
            "url-opener",
            "openUrl url=[$url] project=${project?.name} openProjects=${ProjectManager.getInstance().openProjects.size}",
        )
        val path = PathResolver.extractPath(url)
        if (path == null) {
            DebugLog.log("url-opener", "extractPath returned null")
            return false
        }
        val projects = buildList {
            if (project != null) add(project)
            addAll(ProjectManager.getInstance().openProjects)
        }.distinct()

        for (p in projects) {
            if (p.isDisposed || p.basePath.isNullOrBlank()) continue
            if (PathResolver.openInProject(p, path)) {
                DebugLog.log("url-opener", "SUCCESS opened in ${p.name}: $path")
                ErrorUiDismisser.afterSuccessfulOpen()
                return true
            }
            DebugLog.log("url-opener", "not found in ${p.name} base=${p.basePath}")
        }
        DebugLog.log("url-opener", "FAILED for path=$path")
        return false
    }
}

