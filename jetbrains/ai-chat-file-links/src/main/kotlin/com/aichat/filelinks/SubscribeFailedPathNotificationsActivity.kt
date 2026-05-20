package com.aichat.filelinks

import com.intellij.notification.Notifications
import com.intellij.openapi.project.Project
import com.intellij.openapi.startup.ProjectActivity
import com.intellij.openapi.ui.popup.BalloonListener

class SubscribeFailedPathNotificationsActivity : ProjectActivity {

    override suspend fun execute(project: Project) {
        DebugLog.log("project-start", "ProjectActivity execute project=${project.name} base=${project.basePath}")
        val connection = project.messageBus.connect(project)
        connection.subscribe(Notifications.TOPIC, FailedPathNotificationSubscriber())
        connection.subscribe(BalloonListener.TOPIC, FailedPathBalloonListener())
    }
}

