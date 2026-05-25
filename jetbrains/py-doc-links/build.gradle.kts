import java.util.Properties

plugins {
    kotlin("jvm") version "2.1.0"
    id("org.jetbrains.intellij.platform") version "2.5.0"
}

val localProperties = Properties().apply {
    val file = rootDir.resolve("local.properties")
    if (file.isFile) file.inputStream().use { load(it) }
}

fun publishToken(): String? =
    localProperties.getProperty("publishToken")?.takeIf { it.isNotBlank() }
        ?: System.getenv("PUBLISH_TOKEN")?.takeIf { it.isNotBlank() }

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
        name = "Python Doc Links"
        id = "com.pydoclinks"
        version = project.version.toString()
        description =
            "Makes file, function, class, and module-level variable references in Python docstrings " +
            "and comments Ctrl+Clickable. Supports filename.py, Sphinx :py:func:, :py:class:, " +
            ":py:data:, :py:mod: (and short :func:/:class:/:data: forms). " +
            "Developed with AI assistance."
        changeNotes = """
            <ul>
              <li><b>0.2.7</b> — :py:class:, :py:data:, :py:attr:; :py:func: fallback to class/variable</li>
              <li><b>0.2.6</b> — prefer same-folder files for duplicate names (e.g. main.py)</li>
            </ul>
        """.trimIndent()
        ideaVersion {
            sinceBuild = "243"
        }
    }

    publishing {
        token = providers.provider { publishToken() }
        channels = listOf("default")
    }
}

tasks {
    wrapper {
        gradleVersion = "8.12"
    }
    buildSearchableOptions {
        enabled = false
    }
}
