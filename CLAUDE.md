# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Chrome extension that improves the JIRA website user experience. The extension enhances JIRA's interface and functionality when users are browsing JIRA in their browser.

## Development Commands

Since this is a new Chrome extension project, typical commands will include:

```bash
# Install dependencies
npm install

# Build the extension
npm run build

# Development build with watch mode
npm run dev

# Run linting
npm run lint

# Run tests
npm test

# Package extension for distribution
npm run package
```

## Chrome Extension Architecture

Chrome extensions typically follow this structure:

### Core Files
- `manifest.json` - Extension configuration and permissions
- `background.js` - Service worker for background tasks
- `content.js` - Scripts injected into web pages
- `popup.html/js` - Extension popup interface
- `options.html/js` - Extension settings page

### JIRA UX Enhancement Considerations
- Content script injection into JIRA pages
- DOM manipulation for UI improvements
- CSS styling and layout enhancements
- JavaScript event handling for better interactions
- Data storage for user preferences (chrome.storage API)
- Permission management for JIRA domains
- Page detection and URL matching for JIRA sites

### Security Notes
- Use content security policy in manifest
- Sanitize all user inputs and DOM manipulations
- Store user preferences securely using chrome.storage
- Validate data from JIRA pages before processing
- Be careful with innerHTML and use safer DOM methods

## Development Notes

- Chrome extensions use Manifest V3 format
- Content scripts are the primary mechanism for UX enhancements
- Content scripts run in isolated environments but can access page DOM
- Use chrome.* APIs for extension functionality
- Test UX improvements across different JIRA versions and configurations
- Consider performance impact of DOM modifications
- Handle dynamic content loading in modern JIRA interfaces