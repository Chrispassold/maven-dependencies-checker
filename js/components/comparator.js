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

        init() {
            // Initialize comparator
            console.log('Comparator component initialized');
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
            this.$dispatch('comparison-completed', { 
                added, 
                removed, 
                changed,
                depsOld: this.depsOld,
                depsNew: this.depsNew
            });
            
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