package com.aichat.filelinks

import com.intellij.openapi.application.ApplicationManager
import com.intellij.openapi.components.PersistentStateComponent
import com.intellij.openapi.components.State
import com.intellij.openapi.components.Storage
import com.intellij.util.xmlb.XmlSerializerUtil

@State(name = "AiChatFileLinksSettings", storages = [Storage("ai-chat-file-links.xml")])
class AiChatFileLinksSettings : PersistentStateComponent<AiChatFileLinksSettingsState> {

    private var state = AiChatFileLinksSettingsState()

    override fun getState(): AiChatFileLinksSettingsState = state

    override fun loadState(state: AiChatFileLinksSettingsState) {
        XmlSerializerUtil.copyBean(state, this.state)
    }

    var dismissErrorNotificationOnOpen: Boolean
        get() = state.dismissErrorNotificationOnOpen
        set(value) {
            state.dismissErrorNotificationOnOpen = value
        }

    companion object {
        fun getInstance(): AiChatFileLinksSettings =
            ApplicationManager.getApplication().getService(AiChatFileLinksSettings::class.java)
    }
}

data class AiChatFileLinksSettingsState(
    var dismissErrorNotificationOnOpen: Boolean = true,
)
