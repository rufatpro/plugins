package com.aichat.filelinks

import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.actionSystem.CommonDataKeys
import com.intellij.openapi.project.Project
import com.intellij.openapi.project.ProjectManager

object PluginProjectUtil {

    fun projectFromEvent(e: AnActionEvent): Project? =
        e.getData(CommonDataKeys.PROJECT)
            ?: ProjectManager.getInstance().openProjects.firstOrNull()
}

