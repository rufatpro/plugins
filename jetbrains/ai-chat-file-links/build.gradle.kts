plugins {
    kotlin("jvm") version "2.1.0"
    id("org.jetbrains.intellij.platform") version "2.5.0"
}

group = providers.gradleProperty("pluginGroup").get()
version = providers.gradleProperty("pluginVersion").get()

repositories {
    mavenCentral()
    intellijPlatform {
        defaultRepositories()
    }
}

dependencies {
    intellijPlatform {
        intellijIdeaCommunity("2024.3.5")
    }
}

kotlin {
    jvmToolchain(21)
}

intellijPlatform {
    pluginConfiguration {
        name = "AI Chat File Links"
        id = "com.aichat.filelinks"
        version = project.version.toString()
        description =
            "Opens project-relative files from JetBrains AI Chat when agent links (Cursor, ACP, and others) " +
            "fail with \"Cannot open a URL\" or \"File does not exist\". " +
            "Settings (Tools → AI Chat File Links): \"Dismiss error notification when the file opens successfully\" " +
            "(default on) closes the error balloon after a successful open. Developed with AI assistance."
        ideaVersion {
            sinceBuild = "243"
        }
    }
}

tasks {
    wrapper {
        gradleVersion = "8.12"
    }

    // Headless IDE indexing for settings search; not needed for this plugin and spams WARN in logs.
    buildSearchableOptions {
        enabled = false
    }
}
