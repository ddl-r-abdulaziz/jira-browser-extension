// Popup functionality for JIRA UX Enhancer
class PopupController {
  constructor() {
    this.init();
  }

  init() {
    this.loadSettings();
    this.setupEventListeners();
    this.checkJiraPageStatus();
  }

  setupEventListeners() {
    // Toggle switch
    document.getElementById('editButtons').addEventListener('change', this.handleToggleChange.bind(this));

    // Action buttons
    document.getElementById('refreshEnhancements').addEventListener('click', this.refreshEnhancements.bind(this));
    document.getElementById('resetSettings').addEventListener('click', this.resetSettings.bind(this));

    // Footer links
    document.getElementById('optionsLink').addEventListener('click', this.openOptions.bind(this));
    document.getElementById('helpLink').addEventListener('click', this.openHelp.bind(this));
  }

  loadSettings() {
    chrome.storage.sync.get(['jiraEnhancements'], (result) => {
      const settings = result.jiraEnhancements || {
        editButtons: true
      };

      this.updateToggleStates(settings);
    });
  }

  updateToggleStates(settings) {
    document.getElementById('editButtons').checked = settings.editButtons;
  }

  handleToggleChange(event) {
    const settingName = event.target.id;
    const isEnabled = event.target.checked;

    chrome.storage.sync.get(['jiraEnhancements'], (result) => {
      const settings = result.jiraEnhancements || {};
      settings[settingName] = isEnabled;

      chrome.storage.sync.set({ jiraEnhancements: settings }, () => {
        this.notifyContentScript(settingName, isEnabled);
      });
    });
  }

  notifyContentScript(setting, value) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'updateSetting',
          setting: setting,
          value: value
        }, () => {
          // Handle the case where content script doesn't exist or isn't ready
          if (chrome.runtime.lastError) {
            // Silently ignore - content script may not be injected on this page
            return;
          }
        });
      }
    });
  }

  refreshEnhancements() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'refreshEnhancements'
        }, () => {
          if (chrome.runtime.lastError) {
            this.showTemporaryStatus('No JIRA page detected', 'error');
            return;
          }
          this.showTemporaryStatus('Enhancements refreshed!', 'success');
        });
      }
    });
  }

  resetSettings() {
    const defaultSettings = {
      editButtons: true
    };

    chrome.storage.sync.set({ jiraEnhancements: defaultSettings }, () => {
      this.updateToggleStates(defaultSettings);
      this.showTemporaryStatus('Settings reset to defaults', 'success');
      
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: 'resetSettings',
            settings: defaultSettings
          }, () => {
            if (chrome.runtime.lastError) {
              // Silently ignore - content script may not be injected
              return;
            }
          });
        }
      });
    });
  }

  checkJiraPageStatus() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        const url = tabs[0].url;
        const isJiraPage = this.isJiraUrl(url);
        
        this.updateStatus(isJiraPage);
        
        if (isJiraPage) {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: 'getStatus'
          }, (response) => {
            if (chrome.runtime.lastError) {
              // Content script not ready yet, but page is JIRA
              this.updateStatus(true, 'JIRA page detected');
              return;
            }
            if (response && response.status) {
              this.updateStatus(true, response.status);
            }
          });
        }
      }
    });
  }

  isJiraUrl(url) {
    return url.includes('atlassian.net') || 
           url.includes('/jira/') || 
           url.includes('jira.');
  }

  updateStatus(isJiraPage, status = null) {
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');

    if (isJiraPage) {
      statusDot.className = 'status-dot active';
      statusText.textContent = status || 'JIRA page detected - Enhancements active';
    } else {
      statusDot.className = 'status-dot inactive';
      statusText.textContent = 'Not a JIRA page';
    }
  }

  showTemporaryStatus(message, type = 'info') {
    const statusText = document.getElementById('statusText');
    const originalText = statusText.textContent;
    
    statusText.textContent = message;
    statusText.className = `status-text ${type}`;
    
    setTimeout(() => {
      statusText.textContent = originalText;
      statusText.className = 'status-text';
    }, 2000);
  }

  openOptions(event) {
    event.preventDefault();
    chrome.runtime.openOptionsPage();
  }

  openHelp(event) {
    event.preventDefault();
    chrome.tabs.create({
      url: 'https://github.com/your-username/chrome-jira-plugin#readme'
    });
  }
}

// Initialize popup when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new PopupController();
});