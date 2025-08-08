/**
 * Comparator Component
 * Handles JSON comparison functionality
 */

window.comparatorComponent = function() {
    return {
        jsonOld: '',
        jsonNew: '',
        depsOld: {},
        depsNew: {},
        oldLibraryInfo: { displayName: 'Old JSON (Version 1)' },
        newLibraryInfo: { displayName: 'New JSON (Version 2)' },

        init() {
            // Initialize comparator
            
            // Register this component in the bridge
            if (window.ComponentBridge) {
                window.ComponentBridge.register('comparator', this);
            }
            
            // Listen for copy-to-field events from the app
            window.addEventListener('app-copy-to-field', (event) => {
                const { field, jsonOutput, versionName } = event.detail;
                
                if (field === 'old') {
                    this.jsonOld = jsonOutput;
                    if (versionName) {
                        this.oldLibraryInfo = { displayName: versionName };
                    }
                } else if (field === 'new') {
                    this.jsonNew = jsonOutput;
                    if (versionName) {
                        this.newLibraryInfo = { displayName: versionName };
                    }
                }
            });

            // Note: Library info is now set when copying from search results
            // If JSON is manually pasted, we keep the default titles
        },

        compareJsons() {
            try {
                this.depsOld = JSON.parse(this.jsonOld);
                if (typeof this.depsOld !== 'object' || Array.isArray(this.depsOld) || this.depsOld === null) {
                    throw new Error("Old JSON must be a dependencies object.");
                }
            } catch (e) {
                NotificationUtils.error(`Error in old JSON: ${e.message}`);
                return;
            }

            try {
                this.depsNew = JSON.parse(this.jsonNew);
                if (typeof this.depsNew !== 'object' || Array.isArray(this.depsNew) || this.depsNew === null) {
                    throw new Error("New JSON must be a dependencies object.");
                }
            } catch (e) {
                NotificationUtils.error(`Error in new JSON: ${e.message}`);
                return;
            }

            const added = [];
            const removed = [];
            const changed = [];

            // Check for added or changed dependencies
            for (const key in this.depsNew) {
                if (this.depsOld.hasOwnProperty(key)) {
                    if (this.depsOld[key] !== this.depsNew[key]) {
                        changed.push({ key, oldVersion: this.depsOld[key], newVersion: this.depsNew[key] });
                    }
                } else {
                    added.push({ key, version: this.depsNew[key] });
                }
            }

            // Check for removed dependencies
            for (const key in this.depsOld) {
                if (!this.depsNew.hasOwnProperty(key)) {
                    removed.push({ key, version: this.depsOld[key] });
                }
            }

            // Dispatch event with comparison results
            const comparisonData = { 
                added, 
                removed, 
                changed,
                depsOld: this.depsOld,
                depsNew: this.depsNew
            };
            
            this.$dispatch('comparison-completed', comparisonData);
            
            const totalChanges = added.length + removed.length + changed.length;
            NotificationUtils.success(`Comparison completed: ${totalChanges} changes found.`);
        },

        swapJsons() {
            const temp = this.jsonOld;
            this.jsonOld = this.jsonNew;
            this.jsonNew = temp;
            
            // Clear previous comparison results
            this.$dispatch('clear-comparison');
            
            NotificationUtils.success('JSONs swapped successfully!');
        }
    };
}; 