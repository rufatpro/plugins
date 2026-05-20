package com.aichat.filelinks

import com.intellij.openapi.actionSystem.AnAction
import com.intellij.openapi.actionSystem.AnActionEvent
import com.intellij.openapi.actionSystem.ex.AnActionListener

class DebugAnActionListener : AnActionListener {

    override fun beforeActionPerformed(action: AnAction, dataContext: AnActionEvent) {
        val place = dataContext.place
        if (place.contains("popup", ignoreCase = true) ||
            place.contains("Editor", ignoreCase = true) ||
            place.contains("Chat", ignoreCase = true) ||
            place.contains("AI", ignoreCase = true)
        ) {
            DebugLog.log(
                "action-before",
                "action=${action.javaClass.name} place=$place inputEvent=${dataContext.inputEvent?.javaClass?.name}",
            )
        }
    }

}

