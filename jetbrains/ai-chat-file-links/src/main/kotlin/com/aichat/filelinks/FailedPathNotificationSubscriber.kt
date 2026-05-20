package com.aichat.filelinks

import com.intellij.notification.Notification
import com.intellij.notification.Notifications

class FailedPathNotificationSubscriber : Notifications {

    override fun notify(notification: Notification) {
        DebugLog.log(
            "notifications-bus",
            "notify title=${notification.title} content=${notification.content} group=${notification.groupId}",
        )
        FailedPathCapture.capture(notification)
    }
}

