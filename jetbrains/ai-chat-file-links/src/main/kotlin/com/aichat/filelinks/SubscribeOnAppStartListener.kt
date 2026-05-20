package com.aichat.filelinks

import com.intellij.ide.AppLifecycleListener
import com.intellij.notification.Notifications
import com.intellij.openapi.application.ApplicationManager
import com.intellij.openapi.ui.popup.BalloonListener

class SubscribeOnAppStartListener : AppLifecycleListener {

    override fun appStarted() {
        // DebugLog.log("app-start", "appStarted — subscribing buses + poller")
        val app = ApplicationManager.getApplication()
        val connection = app.messageBus.connect(app)
        connection.subscribe(Notifications.TOPIC, FailedPathNotificationSubscriber())
        connection.subscribe(BalloonListener.TOPIC, FailedPathBalloonListener())
        // NotificationDebugPoller.start() — debug only (C:\tmp logs)
    }
}

