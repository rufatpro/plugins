package com.aichat.filelinks

import com.intellij.openapi.fileEditor.FileEditorManager
import com.intellij.openapi.fileEditor.FileEditorManagerListener
import com.intellij.openapi.project.Project
import com.intellij.openapi.project.ProjectManagerListener
import com.intellij.openapi.vfs.VirtualFile

class DebugProjectManagerListener : ProjectManagerListener {

    override fun projectOpened(project: Project) {
        DebugLog.log("project-opened", "name=${project.name} basePath=${project.basePath}")
        project.messageBus.connect(project).subscribe(
            FileEditorManagerListener.FILE_EDITOR_MANAGER,
            object : FileEditorManagerListener {
                override fun fileOpened(source: FileEditorManager, file: VirtualFile) {
                    DebugLog.log("file-opened", "path=${file.path}")
                }
            },
        )
    }
}

