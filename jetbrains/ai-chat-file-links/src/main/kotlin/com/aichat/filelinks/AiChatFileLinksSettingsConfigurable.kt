package com.aichat.filelinks

import com.intellij.openapi.options.Configurable
import java.awt.BorderLayout
import javax.swing.JCheckBox
import javax.swing.JComponent
import javax.swing.JPanel

class AiChatFileLinksSettingsConfigurable : Configurable {

    private var panel: JPanel? = null
    private var dismissErrorCheckbox: JCheckBox? = null

    private val settings: AiChatFileLinksSettings
        get() = AiChatFileLinksSettings.getInstance()

    override fun getDisplayName(): String = "AI Chat File Links"

    override fun createComponent(): JComponent {
        dismissErrorCheckbox = JCheckBox(
            "Dismiss error notification when the file opens successfully",
            settings.dismissErrorNotificationOnOpen,
        ).apply {
            toolTipText =
                "After a project-relative path is opened (from AI Chat or from the error balloon), " +
                "close the IDE error popup about \"Cannot open a URL\" or \"File does not exist\"."
        }
        panel = JPanel(BorderLayout()).apply {
            add(dismissErrorCheckbox, BorderLayout.NORTH)
        }
        return panel!!
    }

    override fun isModified(): Boolean =
        dismissErrorCheckbox?.isSelected != settings.dismissErrorNotificationOnOpen

    override fun apply() {
        settings.dismissErrorNotificationOnOpen = dismissErrorCheckbox?.isSelected == true
    }

    override fun reset() {
        dismissErrorCheckbox?.isSelected = settings.dismissErrorNotificationOnOpen
    }

    override fun disposeUIResources() {
        panel = null
        dismissErrorCheckbox = null
    }
}
