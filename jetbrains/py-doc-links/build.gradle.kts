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
            "Makes file and function references in Python docstrings and comments Ctrl+Clickable. " +
            "Supports filename.py patterns and Sphinx :py:func:`module.func` / :py:mod:`module` roles. " +
            "Developed with AI assistance."
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
