package com.aichat.filelinks

import com.intellij.notification.Notification
import com.intellij.openapi.application.ApplicationManager
import com.intellij.openapi.ui.popup.Balloon
import com.intellij.openapi.ui.popup.BalloonListener
import java.awt.Component

class FailedPathBalloonListener : BalloonListener {

    override fun balloonShown(balloon: Balloon) {
        DebugLog.log("balloon", "balloonShown class=${balloon.javaClass.name}")
        ApplicationManager.getApplication().invokeLater {
            val notification = notificationFromBalloon(balloon)
            if (notification != null) {
                DebugLog.log("balloon", "reflection got Notification title=${notification.title}")
                ErrorUiDismisser.track(notification, balloon)
                FailedPathCapture.capture(notification)
                return@invokeLater
            }
            DebugLog.log("balloon", "no Notification field, parsing component tree")
            ErrorUiDismisser.track(balloon = balloon)
            FailedPathCapture.captureFromBalloonComponent(balloonContentComponent(balloon))
        }
    }

    private fun notificationFromBalloon(balloon: Balloon): Notification? {
        var type: Class<*>? = balloon.javaClass
        while (type != null) {
            for (fieldName in listOf("myNotification", "notification", "myContent")) {
                try {
                    val field = type.getDeclaredField(fieldName)
                    field.isAccessible = true
                    val value = field.get(balloon)
                    if (value is Notification) return value
                } catch (_: ReflectiveOperationException) {
                    // try next field
                }
            }
            type = type.superclass
        }
        return null
    }

    private fun balloonContentComponent(balloon: Balloon): Component? {
        for (methodName in listOf("getContent", "getContentComponent", "getComponent")) {
            try {
                val method = balloon.javaClass.getMethod(methodName)
                val value = method.invoke(balloon)
                if (value is Component) {
                    DebugLog.log("balloon", "component via $methodName -> ${value.javaClass.name}")
                    return value
                }
            } catch (_: ReflectiveOperationException) {
                // try next
            }
        }
        return null
    }
}

