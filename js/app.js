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
        
        // Global data store for component communication
        globalData: {
            pendingCopyToField: null
        },

        init() {
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
            const { field, jsonOutput, versionName } = event.detail;
            
            try {
                // Store the pending copy operation in global data
                this.globalData.pendingCopyToField = { field, jsonOutput, versionName };
                
                // Try using the component bridge first
                if (window.ComponentBridge && window.ComponentBridge.copyToComparator(field, jsonOutput, versionName)) {
                    console.log('Successfully copied using ComponentBridge');
                } else {
                    // Fallback: Dispatch a window-level event that comparator component can listen to
                    window.dispatchEvent(new CustomEvent('app-copy-to-field', {
                        detail: { field, jsonOutput, versionName }
                    }));
                    console.log('Dispatched app-copy-to-field event');
                }
                
                NotificationUtils.success(`JSON copied to ${field === 'old' ? 'old' : 'new'} field!`);
                
                // Scroll to comparator
                setTimeout(() => {
                    const targetElement = document.querySelector('#jsonOld');
                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 100);
                
            } catch (error) {
                console.error('Error in handleCopyToField:', error);
                NotificationUtils.error('Error copying JSON to field');
            }
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
            
            // Dispatch event to comparison results component
            setTimeout(() => {
                const comparisonComponent = this.$el.querySelector('[x-data*="comparisonResultsComponent"]');
                if (comparisonComponent) {
                    const customEvent = new CustomEvent('comparison-completed', {
                        detail: { added, removed, changed, depsOld, depsNew }
                    });
                    comparisonComponent.dispatchEvent(customEvent);
                }
            }, 100);
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