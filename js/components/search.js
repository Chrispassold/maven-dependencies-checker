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
        versionName: '',
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

                // Extract library name and version from URL
                const urlParts = this.mavenUrl.split('/');
                const version = urlParts[urlParts.length - 1] || '';
                const artifact = urlParts[urlParts.length - 2] || '';
                const group = urlParts[urlParts.length - 3] || '';
                
                // Create library identifier
                this.versionName = `${group}:${artifact}:${version}`;

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
                
                // Dispatch event to results component
                setTimeout(() => {
                    // Try multiple selectors to find the results component
                    const selectors = [
                        '[x-data*="resultsComponent"]',
                        '[x-data*="resultsComponent()"]',
                        '.bg-white.rounded-xl.shadow-lg.p-6.mb-8'
                    ];
                    
                    let resultsComponent = null;
                    for (const selector of selectors) {
                        resultsComponent = document.querySelector(selector);
                        if (resultsComponent) {
                            break;
                        }
                    }
                    
                    if (resultsComponent) {
                        const customEvent = new CustomEvent('search-completed', {
                            detail: { jsonOutput: this.jsonOutput, versionName: this.versionName }
                        });
                        resultsComponent.dispatchEvent(customEvent);
                    }
                    
                    // Also dispatch to window as fallback
                    const windowEvent = new CustomEvent('search-completed', {
                        detail: { jsonOutput: this.jsonOutput, versionName: this.versionName }
                    });
                    window.dispatchEvent(windowEvent);
                }, 100);
                
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