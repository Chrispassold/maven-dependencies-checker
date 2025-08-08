/**
 * Storage Utility Module
 * Handles localStorage operations and data persistence
 */

window.StorageUtils = {
    /**
     * Get recent searches from localStorage
     * @returns {Array} - Array of recent searches
     */
    getRecentSearches() {
        try {
            return JSON.parse(localStorage.getItem('recentSearches') || '[]');
        } catch (error) {
            console.error('Error loading recent searches:', error);
            return [];
        }
    },

    /**
     * Save recent searches to localStorage
     * @param {Array} searches - Array of recent searches
     */
    saveRecentSearches(searches) {
        try {
            localStorage.setItem('recentSearches', JSON.stringify(searches));
        } catch (error) {
            console.error('Error saving recent searches:', error);
        }
    },

    /**
     * Add a new search to recent searches
     * @param {string} url - The URL to add
     * @param {string} displayName - Display name for the search
     * @returns {Array} - Updated recent searches array
     */
    addRecentSearch(url, displayName) {
        const searches = this.getRecentSearches();
        
        // Remove existing entry if it exists
        const existingIndex = searches.findIndex(search => search.url === url);
        if (existingIndex !== -1) {
            searches.splice(existingIndex, 1);
        }
        
        // Add new search to the beginning
        searches.unshift({ url, displayName });
        
        // Keep only the last 10 searches
        if (searches.length > 10) {
            searches.pop();
        }
        
        this.saveRecentSearches(searches);
        return searches;
    },

    /**
     * Remove a search from recent searches
     * @param {number} index - Index of the search to remove
     * @returns {Array} - Updated recent searches array
     */
    removeRecentSearch(index) {
        const searches = this.getRecentSearches();
        searches.splice(index, 1);
        this.saveRecentSearches(searches);
        return searches;
    },

    /**
     * Clear all recent searches
     */
    clearRecentSearches() {
        localStorage.removeItem('recentSearches');
    },

    /**
     * Get display name from URL
     * @param {string} url - Maven repository URL
     * @returns {string} - Display name
     */
    getDisplayName(url) {
        const match = url.match(/https:\/\/mvnrepository\.com\/artifact\/([^/]+)\/([^/]+)\/([^/]+)/);
        if (match) {
            return `${match[2]}:${match[3]}`;
        }
        return url;
    }
}; 