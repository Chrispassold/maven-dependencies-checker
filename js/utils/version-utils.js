/**
 * Version Utilities Module
 * Handles version comparison and analysis functionality
 */

window.VersionUtils = {
    /**
     * Compare two version strings
     * @param {string} version1 - First version to compare
     * @param {string} version2 - Second version to compare
     * @returns {string} - 'up', 'down', or 'equal'
     */
    compareVersions(version1, version2) {
        const normalizeVersion = (version) => {
            const cleanVersion = version.replace(/[^\d.\-]/g, '');
            return cleanVersion.split(/[.\-]/).map(num => {
                const parsed = parseInt(num);
                return isNaN(parsed) ? 0 : parsed;
            });
        };

        const v1 = normalizeVersion(version1);
        const v2 = normalizeVersion(version2);

        const maxLength = Math.max(v1.length, v2.length);
        for (let i = 0; i < maxLength; i++) {
            const part1 = v1[i] || 0;
            const part2 = v2[i] || 0;
            
            if (part1 > part2) return 'down';
            if (part1 < part2) return 'up';
        }
        return 'equal';
    },

    /**
     * Get version change type for display
     * @param {string} version1 - Old version
     * @param {string} version2 - New version
     * @returns {string} - Display text for version change
     */
    getVersionChangeType(version1, version2) {
        const comparison = this.compareVersions(version1, version2);
        switch (comparison) {
            case 'up': return 'UPDATE';
            case 'down': return 'DOWNGRADE';
            case 'equal': return 'IGUAL';
            default: return 'IGUAL';
        }
    },

    /**
     * Get CSS classes for version badge
     * @param {string} version1 - Old version
     * @param {string} version2 - New version
     * @returns {string} - CSS classes for badge styling
     */
    getVersionBadgeClass(version1, version2) {
        const comparison = this.compareVersions(version1, version2);
        switch (comparison) {
            case 'up': return 'bg-green-100 text-green-800 border border-green-200';
            case 'down': return 'bg-red-100 text-red-800 border border-red-200';
            case 'equal': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
            default: return 'bg-gray-100 text-gray-800 border border-gray-200';
        }
    },

    /**
     * Get icon class for version comparison
     * @param {string} version1 - Old version
     * @param {string} version2 - New version
     * @returns {string} - Font Awesome icon class
     */
    getVersionIcon(version1, version2) {
        const comparison = this.compareVersions(version1, version2);
        switch (comparison) {
            case 'up': return 'fas fa-arrow-up text-green-600';
            case 'down': return 'fas fa-arrow-down text-red-600';
            case 'equal': return 'fas fa-equals text-yellow-600';
            default: return 'fas fa-equals text-yellow-600';
        }
    }
}; 