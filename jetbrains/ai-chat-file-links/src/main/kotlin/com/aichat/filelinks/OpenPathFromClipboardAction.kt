package com.aichat.filelinks

import com.intellij.openapi.actionSystem.ActionUpdateThread
import com.intellij.openapi.actionSystem.AnAction
import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.ui.Messages

class OpenPathFromClipboardAction : AnAction() {

    override fun getActionUpdateThread(): ActionUpdateThread = ActionUpdateThread.BGT

    override fun update(e: AnActionEvent) {
        e.presentation.isVisible = true
        e.presentation.isEnabled = PluginProjectUtil.projectFromEvent(e) != null
    }

    override fun actionPerformed(e: AnActionEvent) {
        val project = PluginProjectUtil.projectFromEvent(e) ?: return
        val clipboard = java.awt.Toolkit.getDefaultToolkit().systemClipboard
        val text = clipboard.getData(java.awt.datatransfer.DataFlavor.stringFlavor) as? String
        if (text.isNullOrBlank()) {
            Messages.showWarningDialog(project, "Буфер обмена пуст.", "AI Chat File Links")
            return
        }

        val candidate = text.trim().lines().first().trim().trim('`', '"', '\'')
        val path = PathResolver.extractPath(candidate) ?: PathResolver.normalizePath(candidate)

        if (!PathResolver.openInProject(project, path)) {
            Messages.showWarningDialog(
                project,
                "Файл не найден от корня проекта:\n$path",
                "AI Chat File Links",
            )
        }
    }
}

