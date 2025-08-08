/**
 * Component Bridge Utility
 * @description Provides communication bridge between components
 * @author Sistema
 * @version 1.0.0
 */

window.ComponentBridge = {
    // Storage for component references
    components: {},
    
    /**
     * Register a component
     * @param {string} name - Component name
     * @param {Object} component - Component instance
     */
    register(name, component) {
        this.components[name] = component;
        console.log(`Component registered: ${name}`);
    },
    
    /**
     * Get a registered component
     * @param {string} name - Component name
     * @returns {Object|null} - Component instance or null
     */
    get(name) {
        return this.components[name] || null;
    },
    
    /**
     * Copy JSON to comparator field
     * @param {string} field - Field name ('old' or 'new')
     * @param {string} jsonOutput - JSON content
     * @param {string} versionName - Library version information from search
     */
    copyToComparator(field, jsonOutput, versionName) {
        const comparator = this.get('comparator');
        if (comparator) {
            if (field === 'old') {
                comparator.jsonOld = jsonOutput;
                if (versionName) {
                    comparator.oldLibraryInfo = { displayName: versionName };
                }
            } else if (field === 'new') {
                comparator.jsonNew = jsonOutput;
                if (versionName) {
                    comparator.newLibraryInfo = { displayName: versionName };
                }
            }
            return true;
        }
        return false;
    },
    
    /**
     * Clear all registered components
     */
    clear() {
        this.components = {};
    }
};