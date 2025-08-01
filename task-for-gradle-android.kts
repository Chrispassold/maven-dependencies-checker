/**
 * Task to generate dependencies JSON
 * 
 * This task collects all dependencies from the entire project (including submodules)
 * and generates a JSON file with the format: {"group:name": "version"}
 * 
 * FEATURES:
 * - Collects dependencies from ALL projects and submodules
 * - Includes resolved artifacts and declared dependencies
 * - Includes buildscript dependencies
 * - Handles all configuration types (implementation, api, compileOnly, etc.)
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
 * OUTPUT:
 * - File: dependencies.json (in the project directory where task is executed)
 * - Format: {"androidx.core:core-ktx": "1.12.0", "com.google.android.material:material": "1.11.0"}
 * 
 * STATISTICS:
 * - Shows total dependencies found
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
 */
tasks.register("generateDependenciesJson") {
    description = "Generate a JSON file with dependencies"
    
    // Disable configuration cache for this task
    notCompatibleWithConfigurationCache("This task accesses project configurations at execution time")
    
    doLast {
        val dependenciesMap = mutableMapOf<String, String>()
        
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
                              dependenciesMap[key] = version
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
                            if (!dependenciesMap.containsKey(key)) {
                                dependenciesMap[key] = dependency.version ?: ""
                            }
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
                                dependenciesMap[key] = version
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
        
        // Create JSON content with proper escaping
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
        
        // Write to file in project directory
        val outputFile = file("dependencies.json")
        outputFile.writeText(jsonContent)
        
        println("Dependencies JSON generated successfully at: ${outputFile.absolutePath}")
        println("Total dependencies found: ${dependenciesMap.size}")
    }
}
