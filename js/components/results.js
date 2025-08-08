/**
 * Results Component
 * Handles the results display and copy functionality
 */

window.resultsComponent = function() {
    return {
        results: false,
        jsonOutput: '',
        versionName: '',

        init() {
            // Listen for search results updates
            this.$el.addEventListener('search-completed', (event) => {
                const { jsonOutput, versionName } = event.detail;
                this.jsonOutput = jsonOutput;
                this.versionName = versionName || '';
                this.results = true;
            });
            
            // Also listen for window events as fallback
            window.addEventListener('search-completed', (event) => {
                const { jsonOutput, versionName } = event.detail;
                this.jsonOutput = jsonOutput;
                this.versionName = versionName || '';
                this.results = true;
            });
        },

        copyToClipboard() {
            navigator.clipboard.writeText(this.jsonOutput).then(() => {
                NotificationUtils.success('JSON copied to clipboard!');
            }).catch(err => {
                console.error('Failed to copy:', err);
                NotificationUtils.error('Error copying to clipboard.');
            });
        },

        copyToField(field) {
            // Validate field parameter
            if (!field || (field !== 'old' && field !== 'new')) {
                console.error('Invalid field parameter:', field);
                NotificationUtils.error('Error: Invalid field specified');
                return;
            }
            
            // Validate jsonOutput
            if (!this.jsonOutput || this.jsonOutput.trim().length === 0) {
                console.error('No JSON output to copy');
                NotificationUtils.error('Error: No JSON data to copy');
                return;
            }
            
            try {
                // This will be handled by the main app component
                // We'll emit a custom event to communicate with the parent
                this.$dispatch('copy-to-field', { 
                    field, 
                    jsonOutput: this.jsonOutput,
                    versionName: this.versionName
                });
                
            } catch (error) {
                console.error('Error dispatching copy-to-field event:', error);
                NotificationUtils.error('Error copying JSON to field');
            }
        }
    };
}; 