/**
 * Search Component
 * Handles Maven URL search and dependency extraction
 */

window.searchComponent = function() {
    return {
        mavenUrl: '',
        loading: false,
        results: null,
        jsonOutput: '',
        recentSearches: [],

        init() {
            this.recentSearches = StorageUtils.getRecentSearches();
        },

        isValidUrl(url) {
            return url.startsWith('https://mvnrepository.com/artifact/');
        },

        async fetchDependencies() {
            if (!this.mavenUrl || !this.isValidUrl(this.mavenUrl)) {
                NotificationUtils.error('Please enter a valid Maven Repository URL.');
                return;
            }

            this.loading = true;
            this.results = null;
            this.jsonOutput = '';

            const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(this.mavenUrl)}`;

            try {
                const response = await fetch(proxyUrl);
                if (!response.ok) throw new Error(`Network error: ${response.statusText}`);
                
                const data = await response.json();
                const htmlContent = data.contents;
                
                if (!htmlContent) throw new Error('Could not get HTML content from URL.');

                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlContent, 'text/html');

                const libraryIdentifier = [...doc.querySelectorAll('.breadcrumb a')]
                    .slice(-2)
                    .map(a => a.textContent.trim())
                    .concat(doc.querySelector('.version-header h2 a')?.textContent.trim() ?? '')
                    .join(':');

                const dependencies = {};
                const sections = doc.querySelectorAll('.version-section');
                
                sections.forEach(section => {
                    const table = section.querySelector('table.grid');
                    if (!table) return;
                    
                    const headerCells = table.querySelectorAll('thead th');
                    let artifactIndex = -1, versionIndex = -1;
                    
                    headerCells.forEach((th, index) => {
                        if (th.textContent.trim() === 'Group / Artifact') artifactIndex = index;
                        if (th.textContent.trim() === 'Version') versionIndex = index;
                    });
                    
                    if (artifactIndex === -1 || versionIndex === -1) return;
                    
                    const bodyRows = table.querySelectorAll('tbody tr');
                    bodyRows.forEach(row => {
                        const cells = row.querySelectorAll('td');
                        if (cells.length > Math.max(artifactIndex, versionIndex)) {
                            const key = [...cells[artifactIndex].querySelectorAll('a')]
                                .map(a => a.textContent.trim())
                                .join(':');
                            const version = cells[versionIndex].textContent.trim();
                            if (key && version) dependencies[key] = version;
                        }
                    });
                });

                const sortedDependencies = {};
                Object.keys(dependencies).sort().forEach(key => {
                    sortedDependencies[key] = dependencies[key];
                });

                this.jsonOutput = JSON.stringify(sortedDependencies, null, 2);
                this.results = true;
                
                // Add to recent searches
                const displayName = StorageUtils.getDisplayName(this.mavenUrl);
                this.recentSearches = StorageUtils.addRecentSearch(this.mavenUrl, displayName);
                
                NotificationUtils.success('Dependencies extracted successfully!');

            } catch (error) {
                console.error('Error fetching dependencies:', error);
                this.jsonOutput = JSON.stringify({ 
                    error: 'Error fetching dependencies', 
                    details: error.message 
                }, null, 2);
                this.results = true;
                NotificationUtils.error('Error fetching dependencies. Check the URL.');
            } finally {
                this.loading = false;
            }
        },

        clearResults() {
            this.results = null;
            this.jsonOutput = '';
            this.mavenUrl = '';
        },

        loadRecentSearch(url) {
            this.mavenUrl = url;
            this.fetchDependencies();
        },

        removeRecentSearch(index) {
            this.recentSearches = StorageUtils.removeRecentSearch(index);
        },

        clearRecentSearches() {
            StorageUtils.clearRecentSearches();
            this.recentSearches = [];
            NotificationUtils.info('All recent searches cleared!');
        }
    };
}; 