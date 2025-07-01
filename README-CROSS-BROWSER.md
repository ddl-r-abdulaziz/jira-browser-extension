# Cross-Browser Installation Guide

This extension works on both Chrome/Chromium browsers and Firefox-based browsers (including Floorp).

## Building the Extension

### For Chrome/Chromium/Edge:
```bash
npm run build:chrome
# or
npm run package:chrome  # Creates jira-browser-extension-chrome.zip
```

### For Firefox/Floorp:
```bash
npm run build:firefox
# or  
npm run package:firefox  # Creates jira-browser-extension-firefox.zip
```

### For Both:
```bash
npm run package  # Creates both chrome and firefox packages
```

## Installation Instructions

### Chrome/Chromium/Edge:
1. Build the Chrome version: `npm run build:chrome`
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (top right toggle)
4. Click "Load unpacked" and select the `dist` folder
5. The extension should appear in your extensions list

### Firefox:
1. Build the Firefox version: `npm run build:firefox`
2. Open Firefox and go to `about:debugging`
3. Click "This Firefox" in the left sidebar
4. Click "Load Temporary Add-on"
5. Navigate to the `dist` folder and select `manifest.json`
6. The extension will be loaded temporarily

### Floorp:
Floorp uses the same installation process as Firefox:
1. Build the Firefox version: `npm run build:firefox`
2. Open Floorp and go to `about:debugging`
3. Click "This Firefox" in the left sidebar
4. Click "Load Temporary Add-on"
5. Navigate to the `dist` folder and select `manifest.json`
6. The extension will work in Floorp!

## Permanent Installation

### Chrome Web Store:
- Use the Chrome build (`jira-browser-extension-chrome.zip`)
- Upload to Chrome Web Store Developer Dashboard

### Firefox Add-ons (AMO):
- Use the Firefox build (`jira-browser-extension-firefox.zip`)
- Submit to addons.mozilla.org

### Floorp:
- Floorp can install Firefox extensions from AMO
- Or use the temporary installation method above

## Key Differences Between Versions

### Chrome Version (Manifest V3):
- Uses `chrome.action` API
- Service worker background script
- `host_permissions` for cross-origin requests

### Firefox Version (Manifest V2):
- Uses `browser.browserAction` API  
- Persistent background script
- Permissions include URL patterns directly

### Cross-Browser Compatibility:
- Both versions use the same core functionality
- API calls are abstracted through `browserAPI` constant
- Same UI and features across all browsers

## Testing

### Validate Firefox Build:
```bash
npm run validate:firefox
```

### Test Both Versions:
1. Load Chrome version in Chrome
2. Load Firefox version in Firefox/Floorp
3. Verify all features work identically

The extension provides the same JIRA edit button functionality across all supported browsers!