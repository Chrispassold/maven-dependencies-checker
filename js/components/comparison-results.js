/**
 * Comparison Results Component
 * Handles the display of comparison results and statistics
 */

window.comparisonResultsComponent = function() {
    return {
        comparisonResults: false,
        results: {
            added: [],
            removed: [],
            changed: []
        },
        depsOld: {},
        depsNew: {},

        get activeFilters() {
            const filters = [];
            if (this.filters.showOnlyExisting) filters.push('Only Existing');
            if (!this.filters.showAdded) filters.push('No Additions');
            if (!this.filters.showChanged) filters.push('No Modifications');
            if (!this.filters.showRemoved) filters.push('No Removals');
            if (!this.filters.showUp) filters.push('No Up');
            if (!this.filters.showDown) filters.push('No Down');
            if (!this.filters.showEqual) filters.push('No Equal');
            return filters;
        },

        get filteredResults() {
            let added = this.results.added;
            let removed = this.results.removed;
            let changed = this.results.changed;

            if (this.filters.showOnlyExisting) {
                added = added.filter(item => this.depsOld.hasOwnProperty(item.key));
                changed = changed.filter(item => this.depsOld.hasOwnProperty(item.key));
                removed = removed.filter(item => this.depsOld.hasOwnProperty(item.key));
            }

            changed = changed.filter(item => {
                const comparison = VersionUtils.compareVersions(item.oldVersion, item.newVersion);
                switch (comparison) {
                    case 'up': return this.filters.showUp;
                    case 'down': return this.filters.showDown;
                    case 'equal': return this.filters.showEqual;
                    default: return false;
                }
            });

            return {
                added: this.filters.showAdded ? added : [],
                removed: this.filters.showRemoved ? removed : [],
                changed: this.filters.showChanged ? changed : []
            };
        },

        get hasVisibleChanges() {
            return this.filteredResults.added.length > 0 || 
                   this.filteredResults.removed.length > 0 || 
                   this.filteredResults.changed.length > 0;
        },

        getVersionChangeType(version1, version2) {
            return VersionUtils.getVersionChangeType(version1, version2);
        },

        getVersionBadgeClass(version1, version2) {
            return VersionUtils.getVersionBadgeClass(version1, version2);
        }
    };
}; 