/**
 * Results Component
 * Handles the results display and copy functionality
 */

window.resultsComponent = function() {
    return {
        results: false,
        jsonOutput: '',

        copyToClipboard() {
            navigator.clipboard.writeText(this.jsonOutput).then(() => {
                NotificationUtils.success('JSON copied to clipboard!');
            }).catch(err => {
                console.error('Failed to copy:', err);
                NotificationUtils.error('Error copying to clipboard.');
            });
        },

        copyToField(field) {
            // This will be handled by the main app component
            // We'll emit a custom event to communicate with the parent
            this.$dispatch('copy-to-field', { field, jsonOutput: this.jsonOutput });
        }
    };
}; 