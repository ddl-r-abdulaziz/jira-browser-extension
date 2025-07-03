// Cross-browser compatibility
const browserAPI = (typeof browser !== 'undefined') ? browser : chrome;

// Background script for JIRA UX Enhancer
class BackgroundService {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initializeExtension();
  }

  setupEventListeners() {
    // Handle extension installation
    browserAPI.runtime.onInstalled.addListener((details) => {
      this.handleInstallation(details);
    });

    // Handle messages from content scripts and popup
    browserAPI.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.handleMessage(message, sender, sendResponse);
      return true; // Keep message channel open for async responses
    });

    // Handle tab updates to detect JIRA pages
    browserAPI.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      this.handleTabUpdate(tabId, changeInfo, tab);
    });

    // Handle tab activation
    browserAPI.tabs.onActivated.addListener((activeInfo) => {
      this.handleTabActivation(activeInfo);
    });
  }

  handleInstallation(details) {
    console.log('JIRA UX Enhancer installed:', details.reason);
    
    if (details.reason === 'install') {
      this.setDefaultSettings();
      this.showWelcomeNotification();
    } else if (details.reason === 'update') {
      this.handleUpdate(details.previousVersion);
    }
  }

  setDefaultSettings() {
    const defaultSettings = {
      darkMode: false,
      compactView: false,
      enhancedNavigation: true,
      improvedReadability: true,
      enableNotifications: true
    };

    browserAPI.storage.sync.set({ jiraEnhancements: defaultSettings }, () => {
      console.log('Default settings initialized');
    });
  }

  showWelcomeNotification() {
    if (browserAPI.notifications) {
      browserAPI.notifications.create('welcome', {
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: 'JIRA UX Enhancer Installed',
        message: 'Your JIRA experience is about to get better! Visit any JIRA page to see the enhancements.'
      });
    }
  }

  handleUpdate(previousVersion) {
    console.log(`JIRA UX Enhancer updated from ${previousVersion}`);
    // Handle any migration logic here if needed
  }

  handleMessage(message, sender, sendResponse) {
    switch (message.action) {
      case 'getStatus':
        this.getExtensionStatus(sendResponse);
        break;
      
      case 'updateBadge':
        this.updateBadge(sender.tab.id, message.data);
        break;
      
      case 'logEvent':
        this.logEvent(message.event, message.data);
        break;
      
      case 'getSettings':
        this.getSettings(sendResponse);
        break;
      
      default:
        console.warn('Unknown message action:', message.action);
        sendResponse({ error: 'Unknown action' });
    }
  }

  handleTabUpdate(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete' && tab.url) {
      const isJiraPage = this.isJiraUrl(tab.url);
      
      if (isJiraPage) {
        this.updateBadge(tabId, { active: true });
        this.injectEnhancements(tabId);
      } else {
        this.updateBadge(tabId, { active: false });
      }
    }
  }

  handleTabActivation(activeInfo) {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
      if (tab && tab.url) {
        const isJiraPage = this.isJiraUrl(tab.url);
        this.updateBadge(activeInfo.tabId, { active: isJiraPage });
      }
    });
  }

  isJiraUrl(url) {
    return url.includes('atlassian.net') || 
           url.includes('/jira/') || 
           url.includes('jira.');
  }

  updateBadge(tabId, data) {
    if (data.active) {
      chrome.action.setBadgeText({
        text: '✓',
        tabId: tabId
      });
      chrome.action.setBadgeBackgroundColor({
        color: '#36b37e',
        tabId: tabId
      });
    } else {
      chrome.action.setBadgeText({
        text: '',
        tabId: tabId
      });
    }
  }

  injectEnhancements(tabId) {
    // The content script is already injected via manifest
    // This method can be used for dynamic injection if needed
    chrome.tabs.sendMessage(tabId, {
      action: 'initializeEnhancements'
    }, () => {
      if (chrome.runtime.lastError) {
        console.log('Content script not ready yet');
      }
    });
  }

  getExtensionStatus(sendResponse) {
    chrome.storage.sync.get(['jiraEnhancements'], (result) => {
      const settings = result.jiraEnhancements || {};
      sendResponse({
        status: 'active',
        settings: settings,
        version: chrome.runtime.getManifest().version
      });
    });
  }

  getSettings(sendResponse) {
    chrome.storage.sync.get(['jiraEnhancements'], (result) => {
      sendResponse(result.jiraEnhancements || {});
    });
  }

  logEvent(event, data) {
    console.log(`JIRA UX Enhancer Event: ${event}`, data);
    // Could be extended to send analytics data
  }

  initializeExtension() {
    console.log('JIRA UX Enhancer background service initialized');
    
    // Set up periodic tasks if needed
    this.setupPeriodicTasks();
  }

  setupPeriodicTasks() {
    // Check for updates to JIRA detection patterns
    // This could be extended to fetch updated selectors from a remote source
    setInterval(() => {
      this.checkForUpdates();
    }, 24 * 60 * 60 * 1000); // Once per day
  }

  checkForUpdates() {
    // Placeholder for future update checking logic
    console.log('Checking for pattern updates...');
  }
}

// Initialize the background service
new BackgroundService();