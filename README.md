# JIRA UX Enhancer

A Chrome extension that improves the JIRA website user experience with enhanced interface and functionality.

## Features

- **Enhanced Navigation**: Improved visual feedback and smoother interactions
- **Better Readability**: Optimized typography and spacing for issue views
- **Board Improvements**: Enhanced card styling with hover effects and better visual hierarchy
- **Dark Mode**: Toggle dark theme for better eye comfort
- **Compact View**: Space-efficient layout option
- **Customizable Settings**: Toggle individual enhancements on/off

## Installation

### Development Setup

1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/chrome-jira-plugin.git
   cd chrome-jira-plugin
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

### Load Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked" and select the project directory
4. The JIRA UX Enhancer extension should now appear in your extensions list

## Usage

1. Navigate to any JIRA website (*.atlassian.net or */jira/*)
2. The extension will automatically detect JIRA pages and apply enhancements
3. Click the extension icon in the toolbar to access settings
4. Toggle individual features on/off as needed

## Development

### Available Scripts

- `npm run build` - Build the extension
- `npm run dev` - Build and watch for changes
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run package` - Create distribution zip file
- `npm test` - Run tests (to be implemented)

### Project Structure

```
chrome-jira-plugin/
├── manifest.json       # Extension configuration
├── background.js       # Background service worker
├── content.js         # Content script for JIRA pages
├── popup.html         # Extension popup interface
├── popup.js           # Popup functionality
├── popup.css          # Popup styling
├── styles.css         # JIRA page enhancements
├── icons/             # Extension icons
├── package.json       # Dependencies and scripts
└── README.md          # This file
```

## Supported JIRA Versions

This extension is designed to work with:
- Atlassian Cloud JIRA instances (*.atlassian.net)
- JIRA Server/Data Center instances
- Modern JIRA interface versions

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m 'Add feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have suggestions for improvements, please create an issue on GitHub.