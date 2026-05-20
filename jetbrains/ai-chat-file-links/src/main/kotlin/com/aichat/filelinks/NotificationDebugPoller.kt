package com.aichat.filelinks

import com.intellij.notification.Notification
import com.intellij.openapi.application.ApplicationManager
import com.intellij.openapi.project.ProjectManager
import com.intellij.util.concurrency.AppExecutorUtil
import java.util.concurrent.TimeUnit

/**
 * Debug: polls IDE notification model and tries capture (in case bus listeners miss events).
 */
object NotificationDebugPoller {

    @Volatile
    private var started = false

    private val seen = mutableSetOf<String>()

    fun start() {
        if (started) return
        started = true
        DebugLog.log("poller", "started")
        AppExecutorUtil.getAppScheduledExecutorService().scheduleWithFixedDelay(
            { tick() },
            1,
            1,
            TimeUnit.SECONDS,
        )
    }

    private fun tick() {
        if (ApplicationManager.getApplication().isDisposed) return
        try {
            val modelClass = Class.forName("com.intellij.notification.impl.ApplicationNotificationsModel")
            for (project in ProjectManager.getInstance().openProjects) {
                if (project.isDisposed) continue
                val notifications = loadNotifications(modelClass, project) ?: continue
                for (n in notifications) {
                    val key = "${n.hashCode()}:${n.content}:${n.title}"
                    if (!seen.add(key)) continue
                    DebugLog.log(
                        "poller",
                        "new notification project=${project.name} title=${n.title} content=${n.content}",
                    )
                    FailedPathCapture.capture(n)
                }
            }
            loadAppNotifications(modelClass)?.forEach { n ->
                val key = "app:${n.hashCode()}:${n.content}:${n.title}"
                if (!seen.add(key)) return@forEach
                DebugLog.log("poller", "new app notification title=${n.title} content=${n.content}")
                FailedPathCapture.capture(n)
            }
        } catch (t: Throwable) {
            DebugLog.log("poller", "tick error: ${t.message}", t)
        }
    }

    private fun loadNotifications(modelClass: Class<*>, project: com.intellij.openapi.project.Project): List<Notification>? {
        for (methodName in listOf("getNotifications", "getAllNotifications")) {
            try {
                val method = modelClass.getMethod(methodName, com.intellij.openapi.project.Project::class.java)
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
                val method = modelClass.getMethod(methodName, com.intellij.openapi.project.Project::class.java)
                @Suppress("UNCHECKED_CAST")
                return method.invoke(null, null as com.intellij.openapi.project.Project?) as? List<Notification>
            } catch (_: ReflectiveOperationException) {
                // try next
            }
        }
        return null
    }
}

