/**
 * Main Application Component
 * Coordinates all other components and handles global state
 */

window.app = function() {
    return {
        // Global state
        searchResults: null,
        comparisonResults: null,
        filters: {
            showAdded: true,
            showChanged: true,
            showRemoved: true,
            showOnlyExisting: false,
            showUp: true,
            showDown: true,
            showEqual: true
        },

        init() {
            console.log('Main application initialized');
            
            // Listen for events from child components
            this.$watch('searchResults', (value) => {
                if (value) {
                    // Update results component
                    this.$dispatch('update-results', value);
                }
            });

            this.$watch('comparisonResults', (value) => {
                if (value) {
                    // Update comparison results component
                    this.$dispatch('update-comparison-results', value);
                }
            });
        },

        // Event handlers for component communication
        handleCopyToField(event) {
            const { field, jsonOutput } = event.detail;
            
            if (field === 'old') {
                // Find the comparator component and update its jsonOld
                const comparator = this.$el.querySelector('[x-data*="comparatorComponent"]').__x.$data;
                comparator.jsonOld = jsonOutput;
            } else {
                // Find the comparator component and update its jsonNew
                const comparator = this.$el.querySelector('[x-data*="comparatorComponent"]').__x.$data;
                comparator.jsonNew = jsonOutput;
            }
            
            NotificationUtils.success(`JSON copied to ${field === 'old' ? 'old' : 'new'} field!`);
            
            // Scroll to comparator
            setTimeout(() => {
                document.querySelector('#jsonOld').scrollIntoView({ behavior: 'smooth' });
            }, 100);
        },

        handleComparisonCompleted(event) {
            const { added, removed, changed, depsOld, depsNew } = event.detail;
            
            // Update comparison results
            this.comparisonResults = {
                added,
                removed,
                changed,
                depsOld,
                depsNew
            };
        },

        handleClearComparison() {
            this.comparisonResults = null;
        },

        handleUpdateResults(event) {
            this.searchResults = event.detail;
        },

        handleUpdateComparisonResults(event) {
            this.comparisonResults = event.detail;
        }
    };
}; 