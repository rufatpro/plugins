package com.aichat.filelinks

import com.intellij.notification.Notification
import com.intellij.openapi.application.ApplicationManager
import com.intellij.openapi.project.Project
import com.intellij.openapi.project.ProjectManager
import com.intellij.openapi.ui.popup.Balloon

/**
 * Tracks the latest AI Chat file-error balloon/notification and dismisses it after a successful open.
 */
object ErrorUiDismisser {

    @Volatile
    private var trackedNotification: Notification? = null

    @Volatile
    private var trackedBalloon: Balloon? = null

    fun track(notification: Notification? = null, balloon: Balloon? = null) {
        if (notification != null) {
            trackedNotification = notification
            DebugLog.log("dismiss", "track notification title=${notification.title}")
        }
        if (balloon != null) {
            trackedBalloon = balloon
            DebugLog.log("dismiss", "track balloon class=${balloon.javaClass.name}")
        }
    }

    fun afterSuccessfulOpen() {
        if (!AiChatFileLinksSettings.getInstance().dismissErrorNotificationOnOpen) {
            DebugLog.log("dismiss", "skip: setting disabled")
            return
        }
        ApplicationManager.getApplication().invokeLater {
            dismissTracked()
            dismissMatchingInNotificationModel()
        }
    }

    private fun dismissTracked() {
        val notification = trackedNotification
        if (notification != null) {
            try {
                notification.expire()
                DebugLog.log("dismiss", "expired tracked notification")
            } catch (t: Throwable) {
                DebugLog.log("dismiss", "expire notification failed: ${t.message}")
            }
        }
        val balloon = trackedBalloon
        if (balloon != null) {
            try {
                balloon.hide()
                DebugLog.log("dismiss", "hid tracked balloon")
            } catch (t: Throwable) {
                DebugLog.log("dismiss", "hide balloon failed: ${t.message}")
            }
        }
        trackedNotification = null
        trackedBalloon = null
    }

    private fun dismissMatchingInNotificationModel() {
        try {
            val modelClass = Class.forName("com.intellij.notification.impl.ApplicationNotificationsModel")
            for (project in ProjectManager.getInstance().openProjects) {
                if (!project.isDisposed) {
                    expireMatching(loadNotifications(modelClass, project))
                }
            }
            expireMatching(loadAppNotifications(modelClass))
        } catch (t: Throwable) {
            DebugLog.log("dismiss", "scan notifications failed: ${t.message}")
        }
    }

    private fun expireMatching(notifications: List<Notification>?) {
        notifications?.forEach { n ->
            val text = "${n.title.orEmpty()}\n${n.content.orEmpty()}"
            if (FailedPathCapture.isFileOpenErrorText(text)) {
                try {
                    n.expire()
                    DebugLog.log("dismiss", "expired matching notification: ${n.title}")
                } catch (_: Throwable) {
                    // ignore
                }
            }
        }
    }

    private fun loadNotifications(modelClass: Class<*>, project: Project): List<Notification>? {
        for (methodName in listOf("getNotifications", "getAllNotifications")) {
            try {
                val method = modelClass.getMethod(methodName, Project::class.java)
                @Suppress("UNCHECKED_CAST")
                return method.invoke(null, project) as? List<Notification>
            } catch (_: ReflectiveOperationException) {
                // try next
            }
        }
        return null
    }

    private fun loadAppNotifications(modelClass: Class<*>): List<Notification>? {
        for (methodName in listOf("getNotifications", "getAllNotifications")) {
            try {
                val method = modelClass.getMethod(methodName, Project::class.java)
                @Suppress("UNCHECKED_CAST")
                return method.invoke(null, null as Project?) as? List<Notification>
            } catch (_: ReflectiveOperationException) {
                // try next
            }
        }
        return null
    }
}
