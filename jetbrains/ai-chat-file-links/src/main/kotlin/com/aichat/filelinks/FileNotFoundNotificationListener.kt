package com.aichat.filelinks

import com.intellij.notification.Notification
import com.intellij.notification.NotificationListener
import com.intellij.openapi.project.ProjectManager
import com.intellij.openapi.ui.Messages
import javax.swing.event.HyperlinkEvent

class FileNotFoundNotificationListener : NotificationListener {

    override fun hyperlinkUpdate(notification: Notification, event: HyperlinkEvent) {
        DebugLog.log(
            "notification-hyperlink",
            "eventType=${event.eventType} url=${event.url} desc=${event.description} content=${notification.content}",
        )
        FailedPathCapture.capture(notification)

        if (event.eventType != HyperlinkEvent.EventType.ACTIVATED) return

        val project = ProjectManager.getInstance().openProjects.firstOrNull() ?: return
        val raw = event.url?.toString() ?: event.description ?: LastFailedPathHolder.lastPath ?: return
        val path = PathResolver.extractPath(raw) ?: PathResolver.extractFromNotification(notification.content.orEmpty()) ?: return

        ErrorUiDismisser.track(notification)

        if (PathResolver.openInProject(project, path)) {
            ErrorUiDismisser.afterSuccessfulOpen()
        } else {
            Messages.showWarningDialog(
                project,
                "Файл не найден от корня проекта:\n$path",
                "AI Chat File Links",
            )
        }
    }
}

