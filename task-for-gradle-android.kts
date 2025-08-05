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
 * - TRACKS SOURCE INFORMATION for each version found
 * - Generates files in build/ directory following Gradle conventions
 *
 * USAGE:
 *
 * 1. To run from root project (recommended):
 *    ./gradlew generateDependenciesJson
 *
 * 2. To run from a specific module:
 *    ./gradlew :app:generateDependenciesJson
 *    ./gradlew :base-app:app:generateDependenciesJson
 *
 * OUTPUT FILES:
 * - File: build/dependencies.json (highest versions only)
 * - File: build/dependencies-conflicts.json (all versions with sources)
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
 * dependencies-conflicts.json (all versions with sources):
 * {
 *   "androidx.core:core-ktx": {
 *     "1.10.0": ["app:implementation", "common:api"],
 *     "1.12.0": ["app:implementation", "ui-commons:implementation"]
 *   },
 *   "com.google.android.material:material": {
 *     "1.9.0": ["app:implementation"],
 *     "1.11.0": ["app:implementation", "uikit:api"]
 *   }
 * }
 *
 * SOURCE INFORMATION:
 * - "project:configuration": Resolved dependency (e.g., "app:implementation")
 * - "project:configuration:declared": Declared but unresolved dependency
 * - "project:buildscript:configuration": Buildscript dependency
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
 * - Root: ./gradlew generateDependenciesJson (all projects)
 * - App: ./gradlew :app:generateDependenciesJson (app only)
 * - Module: ./gradlew :base-app:common:generateDependenciesJson (common module only)
 *
 * CLEANUP:
 * - Files are generated in build/ directory
 * - Automatically cleaned with ./gradlew clean
 * - Follows Gradle conventions for build artifacts
 */
tasks.register("generateDependenciesJson") {
    description = "Generate a JSON file with dependencies"

    // Disable configuration cache for this task
    notCompatibleWithConfigurationCache("This task accesses project configurations at execution time")

    doLast {
        val dependenciesMap = mutableMapOf<String, String>()
        val allVersionsMap = mutableMapOf<String, MutableMap<String, MutableSet<String>>>()
        val versionConflicts = mutableMapOf<String, MutableSet<String>>()

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
        fun addDependency(key: String, version: String, source: String) {
            // Always add to allVersionsMap to track all versions with their sources
            if (!allVersionsMap.containsKey(key)) {
                allVersionsMap[key] = mutableMapOf()
            }
            if (!allVersionsMap[key]!!.containsKey(version)) {
                allVersionsMap[key]!![version] = mutableSetOf()
            }
            allVersionsMap[key]!![version]!!.add(source)
            
            // Update dependenciesMap with highest version
            if (dependenciesMap.containsKey(key)) {
                val existingVersion = dependenciesMap[key]!!
                val higherVersion = compareVersions(existingVersion, version)
                
                if (higherVersion != existingVersion) {
                    // Track version conflicts for reporting
                    if (!versionConflicts.containsKey(key)) {
                        versionConflicts[key] = mutableSetOf()
                    }
                    versionConflicts[key]!!.add(existingVersion)
                    versionConflicts[key]!!.add(version)
                    
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
                            configuration.resolvedConfiguration.resolvedArtifacts.forEach { artifact ->
                                val key = "${artifact.moduleVersion.id.group}:${artifact.moduleVersion.id.name}"
                                val version = artifact.moduleVersion.id.version
                                val source = "${project.name}:${configuration.name}"
                                addDependency(key, version, source)
                            }
                        } catch (e: Exception) {
                            // Skip configurations that can't be resolved
                        }
                    }
                }

                // Also check declared dependencies for unresolved ones
                project.configurations.forEach { configuration ->
                    configuration.allDependencies.forEach { dependency ->
                        if (dependency.group != null && dependency.version != null) {
                            val key = "${dependency.group}:${dependency.name}"
                            val source = "${project.name}:${configuration.name}:declared"
                            addDependency(key, dependency.version ?: "", source)
                        }
                    }
                }

                // Get buildscript dependencies
                project.buildscript.configurations.forEach { configuration ->
                    if (configuration.isCanBeResolved) {
                        try {
                            configuration.resolvedConfiguration.resolvedArtifacts.forEach { artifact ->
                                val key = "${artifact.moduleVersion.id.group}:${artifact.moduleVersion.id.name}"
                                val version = artifact.moduleVersion.id.version
                                val source = "${project.name}:buildscript:${configuration.name}"
                                addDependency(key, version, source)
                            }
                        } catch (e: Exception) {
                            // Skip if can't resolve
                        }
                    }
                }

            } catch (e: Exception) {
                // Skip projects that can't be processed
                println("Warning: Could not process project ${project.name}: ${e.message}")
            }
        }

        // Create JSON content for dependencies.json (highest versions only)
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

        // Create JSON content for dependencies-conflicts.json (all versions with sources)
        val conflictsJsonContent = buildString {
            appendLine("{")
            val entries = allVersionsMap.entries.sortedBy { it.key }
            entries.forEachIndexed { index, entry ->
                // Escape quotes in the key
                val escapedKey = entry.key.replace("\"", "\\\"")
                append("  \"$escapedKey\": {")
                
                // Add all versions with their sources
                val sortedVersions = entry.value.entries.sortedWith { v1, v2 -> 
                    compareVersions(v1.key, v2.key).compareTo(v1.key) 
                }
                sortedVersions.forEachIndexed { versionIndex, versionEntry ->
                    val escapedVersion = versionEntry.key.replace("\"", "\\\"")
                    append("\"$escapedVersion\": [")
                    
                    // Add sources for this version
                    val sortedSources = versionEntry.value.sorted()
                    sortedSources.forEachIndexed { sourceIndex, source ->
                        val escapedSource = source.replace("\"", "\\\"")
                        append("\"$escapedSource\"")
                        if (sourceIndex < sortedSources.size - 1) {
                            append(", ")
                        }
                    }
                    
                    append("]")
                    if (versionIndex < sortedVersions.size - 1) {
                        append(",")
                    }
                }
                
                append("}")
                if (index < entries.size - 1) {
                    append(",")
                }
                appendLine()
            }
            append("}")
        }

        // Write dependencies.json (highest versions)
        val outputFile = file("build/dependencies.json")
        outputFile.parentFile.mkdirs()
        outputFile.writeText(jsonContent)

        // Write dependencies-conflicts.json (all versions with sources)
        val conflictsOutputFile = file("build/dependencies-conflicts.json")
        conflictsOutputFile.writeText(conflictsJsonContent)

        println("Dependencies JSON generated successfully at: ${outputFile.absolutePath}")
        println("Dependencies conflicts JSON generated successfully at: ${conflictsOutputFile.absolutePath}")
    }
}