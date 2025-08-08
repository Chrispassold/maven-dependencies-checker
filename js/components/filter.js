/**
 * Filter Component
 * Handles filtering functionality for comparison results
 */

window.filterComponent = function() {
    return {
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
            // Share filters with other components via events
            this.$watch('filters', (value) => {
                this.$dispatch('filters-updated', value);
                
                // Also dispatch to comparison results component
                setTimeout(() => {
                    const comparisonComponent = document.querySelector('[x-data*="comparisonResultsComponent"]');
                    if (comparisonComponent) {
                        const customEvent = new CustomEvent('filters-updated', {
                            detail: value
                        });
                        comparisonComponent.dispatchEvent(customEvent);
                    }
                }, 50);
            }, { deep: true });
        },

        selectAllFilters() {
            this.filters.showAdded = true;
            this.filters.showChanged = true;
            this.filters.showRemoved = true;
            this.filters.showUp = true;
            this.filters.showDown = true;
            this.filters.showEqual = true;
            NotificationUtils.success('All filters have been selected!');
        },

        deselectAllFilters() {
            this.filters.showAdded = false;
            this.filters.showChanged = false;
            this.filters.showRemoved = false;
            this.filters.showUp = false;
            this.filters.showDown = false;
            this.filters.showEqual = false;
            NotificationUtils.info('All filters have been deselected!');
        },

        selectOnlyChanges() {
            this.filters.showAdded = true;
            this.filters.showChanged = true;
            this.filters.showRemoved = true;
            this.filters.showUp = true;
            this.filters.showDown = true;
            this.filters.showEqual = false;
            NotificationUtils.success('Filters configured to show only changes!');
        }
    };
}; 