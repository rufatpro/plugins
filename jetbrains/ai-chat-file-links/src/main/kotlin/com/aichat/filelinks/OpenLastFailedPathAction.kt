package com.aichat.filelinks

import com.intellij.openapi.actionSystem.ActionUpdateThread
import com.intellij.openapi.actionSystem.AnAction
import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.ui.Messages

class OpenLastFailedPathAction : AnAction() {

    override fun getActionUpdateThread(): ActionUpdateThread = ActionUpdateThread.BGT

    override fun update(e: AnActionEvent) {
        val hasProject = PluginProjectUtil.projectFromEvent(e) != null
        e.presentation.isVisible = true
        e.presentation.isEnabled = hasProject && LastFailedPathHolder.lastPath != null
    }

    override fun actionPerformed(e: AnActionEvent) {
        val project = PluginProjectUtil.projectFromEvent(e) ?: return
        val path = LastFailedPathHolder.lastPath
        if (path.isNullOrBlank()) {
            Messages.showWarningDialog(
                project,
                "Сначала кликните по битой ссылке в AI Chat (запомнится путь из ошибки).",
                "AI Chat File Links",
            )
            return
        }
        if (!PathResolver.openInProject(project, path)) {
            Messages.showWarningDialog(
                project,
                "Файл не найден от корня проекта:\n$path",
                "AI Chat File Links",
            )
        }
    }
}

