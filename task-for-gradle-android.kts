/**
 * Task to generate dependencies JSON
 *
 * This task collects all dependencies from the entire project (including submodules)
 * and generates two JSON files with comprehensive dependency information.
 *
 * FEATURES:
 * - Collects dependencies from ALL projects and submodules
 * - Includes resolved artifacts and declared dependencies
 * - Includes buildscript dependencies
 * - Handles all configuration types (implementation, api, compileOnly, etc.)
 * - CONSIDERS THE HIGHEST VERSION when multiple versions exist for the same dependency
 * - Generates clean JSON output in build/ directory following Gradle conventions
 *
 * USAGE:
 *
 * IMPORTANT: This task requires configuration cache to be disabled. Use --no-configuration-cache flag.
 *
 * 1. To run from root project (recommended):
 *    ./gradlew generateDependenciesJson --no-configuration-cache
 *
 * 2. To run from a specific module:
 *    ./gradlew :app:generateDependenciesJson --no-configuration-cache
 *    ./gradlew :base-app:app:generateDependenciesJson --no-configuration-cache
 *
 * OUTPUT FILES:
 * - File: build/dependencies.json (highest versions only)
 *
 * OUTPUT FORMATS:
 *
 * dependencies.json (highest versions):
 * {
 *   "androidx.core:core-ktx": "1.12.0",
 *   "com.google.android.material:material": "1.11.0",
 *   "org.jetbrains.kotlin:kotlin-stdlib": "1.9.0"
 * }
 *

 *
 * VERSION COMPARISON:
 * - Supports semantic versioning (1.2.3, 1.2.3-alpha, etc.)
 * - Compares versions numerically and lexicographically
 * - Always selects the highest version when conflicts exist
 *
 * WHERE TO ADD THIS TASK:
 * - Add to root build.gradle.kts (current location) - for project-wide analysis
 * - Add to specific module build.gradle.kts - for module-specific analysis
 * - Add to any subproject build.gradle.kts - for that project only
 *
 * EXAMPLES:
 * - Root: ./gradlew generateDependenciesJson --no-configuration-cache (all projects)
 * - App: ./gradlew :app:generateDependenciesJson --no-configuration-cache (app only)
 * - Module: ./gradlew :base-app:common:generateDependenciesJson --no-configuration-cache (common module only)
 *
 * CLEANUP:
 * - Files are generated in build/ directory
 * - Automatically cleaned with ./gradlew clean
 * - Follows Gradle conventions for build artifacts
 */
tasks.register("generateDependenciesJson") {
    description = "Generate a JSON file with dependencies"

    // Disable configuration cache for this task
    notCompatibleWithConfigurationCache("This task accesses project configurations and dependency resolution at execution time")

    doLast {
        val dependenciesMap = mutableMapOf<String, String>()

        /**
         * Helper function to compare version strings and return the higher version
         * Supports semantic versioning (1.2.3, 1.2.3-alpha, etc.)
         */
        fun compareVersions(version1: String, version2: String): String {
            if (version1 == version2) return version1
            
            // Split versions into parts
            val parts1 = version1.split(".")
            val parts2 = version2.split(".")
            
            // Compare each part
            val maxLength = maxOf(parts1.size, parts2.size)
            for (i in 0 until maxLength) {
                val part1 = parts1.getOrNull(i) ?: "0"
                val part2 = parts2.getOrNull(i) ?: "0"
                
                // Try to compare as numbers first
                val num1 = part1.toIntOrNull()
                val num2 = part2.toIntOrNull()
                
                if (num1 != null && num2 != null) {
                    if (num1 != num2) {
                        return if (num1 > num2) version1 else version2
                    }
                } else {
                    // If not numbers, compare as strings
                    val comparison = part1.compareTo(part2)
                    if (comparison != 0) {
                        return if (comparison > 0) version1 else version2
                    }
                }
            }
            
            // If all parts are equal, return the longer version (more specific)
            return if (version1.length >= version2.length) version1 else version2
        }

        /**
         * Helper function to add or update dependency with version comparison
         */
        fun addDependency(key: String, version: String) {
            // Update dependenciesMap with highest version
            if (dependenciesMap.containsKey(key)) {
                val existingVersion = dependenciesMap[key]!!
                val higherVersion = compareVersions(existingVersion, version)
                
                if (higherVersion != existingVersion) {
                    dependenciesMap[key] = higherVersion
                    println("Version conflict resolved for $key: $existingVersion -> $higherVersion")
                }
            } else {
                dependenciesMap[key] = version
            }
        }

        // Collect dependencies from all projects (including submodules)
        allprojects.forEach { project ->
            try {
                // Get dependencies from all configurations in each project
                project.configurations.forEach { configuration ->
                    if (configuration.isCanBeResolved) {
                        try {
                            // Force resolution to ensure we have access to resolved artifacts
                            configuration.resolve()
                            
                                                        configuration.resolvedConfiguration.resolvedArtifacts.forEach { artifact ->
                                val key = "${artifact.moduleVersion.id.group}:${artifact.moduleVersion.id.name}"
                                val version = artifact.moduleVersion.id.version
                                addDependency(key, version)
                            }
                        } catch (e: Exception) {
                            // Skip configurations that can't be resolved
                            println("Warning: Could not resolve configuration ${configuration.name} in project ${project.name}: ${e.message}")
                        }
                    }
                }

                // Also check declared dependencies for unresolved ones
                project.configurations.forEach { configuration ->
                    configuration.allDependencies.forEach { dependency ->
                        if (dependency.group != null && dependency.version != null) {
                            val key = "${dependency.group}:${dependency.name}"
                            addDependency(key, dependency.version ?: "")
                        }
                    }
                }

                // Get buildscript dependencies
                project.buildscript.configurations.forEach { configuration ->
                    if (configuration.isCanBeResolved) {
                        try {
                            // Force resolution to ensure we have access to resolved artifacts
                            configuration.resolve()
                            
                            configuration.resolvedConfiguration.resolvedArtifacts.forEach { artifact ->
                                val key = "${artifact.moduleVersion.id.group}:${artifact.moduleVersion.id.name}"
                                val version = artifact.moduleVersion.id.version
                                addDependency(key, version)
                            }
                        } catch (e: Exception) {
                            // Skip if can't resolve
                            println("Warning: Could not resolve buildscript configuration ${configuration.name} in project ${project.name}: ${e.message}")
                        }
                    }
                }

            } catch (e: Exception) {
                // Skip projects that can't be processed
                println("Warning: Could not process project ${project.name}: ${e.message}")
            }
        }

        // Create JSON content for dependencies.json
        val jsonContent = buildString {
            appendLine("{")
            val entries = dependenciesMap.entries.sortedBy { it.key }
            entries.forEachIndexed { index, entry ->
                // Escape quotes in the key and value
                val escapedKey = entry.key.replace("\"", "\\\"")
                val escapedValue = entry.value.replace("\"", "\\\"")
                append("  \"$escapedKey\": \"$escapedValue\"")
                if (index < entries.size - 1) {
                    append(",")
                }
                appendLine()
            }
            append("}")
        }

        // Write dependencies.json
        val outputFile = file("build/dependencies.json")
        outputFile.parentFile.mkdirs()
        outputFile.writeText(jsonContent)

        println("Dependencies JSON generated successfully at: ${outputFile.absolutePath}")
        println("Total dependencies found: ${dependenciesMap.size}")
    }
}