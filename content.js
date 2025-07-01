// JIRA UX Enhancement Content Script
class JiraEnhancer {
  constructor() {
    this.init();
  }

  init() {
    this.detectJiraPage();
    this.setupEventListeners();
    this.loadUserPreferences();
  }

  detectJiraPage() {
    const isJiraPage = this.isJiraWebsite();
    if (!isJiraPage) {
      return;
    }

    this.applyEnhancements();
  }

  isJiraWebsite() {
    return (
      window.location.hostname.includes('atlassian.net') ||
      window.location.pathname.includes('/jira/') ||
      document.querySelector('[data-testid="navigation.ui.productHome"]') ||
      document.querySelector('#jira-header') ||
      document.title.toLowerCase().includes('jira')
    );
  }

  setupEventListeners() {
    // Listen for dynamic content changes in JIRA
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          this.handleDynamicContent(mutation.addedNodes);
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Listen for page navigation
    window.addEventListener('popstate', () => {
      setTimeout(() => this.applyEnhancements(), 500);
    });

    // Listen for messages from popup
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === 'updateSetting') {
        this.handleSettingUpdate(message.setting, message.value);
      } else if (message.action === 'resetSettings') {
        this.handleSettingsReset(message.settings);
      } else if (message.action === 'refreshEnhancements') {
        this.refreshEnhancements();
        sendResponse({ status: 'refreshed' });
      }
    });
  }

  handleDynamicContent(addedNodes) {
    addedNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        this.enhanceElement(node);
      }
    });
  }

  applyEnhancements() {
    // Only apply basic enhancements initially
    // Edit buttons will be applied when user preferences are loaded
  }

  enhanceIssueViews() {
    // Add enhancement for issue detail views
    const issueView = document.querySelector('[data-testid="issue.views.issue-base.foundation.summary.heading"]');
    if (issueView) {
      this.addIssueEnhancements(issueView);
    }
  }

  enhanceBoards() {
    // Add enhancement for board views
    const boardView = document.querySelector('[data-testid="software-board"]');
    if (boardView) {
      this.addBoardEnhancements(boardView);
    }
  }

  enhanceNavigation() {
    // Improve navigation experience
    const nav = document.querySelector('#navigation-app') || document.querySelector('[data-testid="navigation"]');
    if (nav) {
      nav.classList.add('jira-enhanced-nav');
    }
  }

  improveReadability() {
    // Apply general readability improvements
    document.body.classList.add('jira-ux-enhanced');
  }

  enhanceElement(element) {
    // Apply enhancements to dynamically added elements
    if (element.matches && element.matches('[data-testid*="issue"]')) {
      this.addIssueEnhancements(element);
    }
    
    // Check for editable fields in the new content
    this.processEditableFields(element);
  }

  addIssueEnhancements(element) {
    if (!element.classList.contains('enhanced')) {
      element.classList.add('enhanced', 'issue-enhanced');
    }
  }

  addBoardEnhancements(element) {
    if (!element.classList.contains('enhanced')) {
      element.classList.add('enhanced', 'board-enhanced');
    }
  }

  loadUserPreferences() {
    chrome.storage.sync.get(['jiraEnhancements'], (result) => {
      if (result.jiraEnhancements) {
        this.applyUserPreferences(result.jiraEnhancements);
      }
    });
  }

  applyUserPreferences(preferences) {
    // Store preferences for later use
    this.preferences = preferences;
    
    // Apply the edit buttons feature if enabled
    if (preferences.editButtons !== false) {
      this.enhanceEditableFields();
    }
  }

  enhanceEditableFields() {
    // Find and process all editable fields on the page
    this.processEditableFields(document);
    
    // Also set up a delayed enhancement in case JIRA loads handlers later
    setTimeout(() => {
      this.processEditableFields(document);
    }, 2000);
    
    // Set up periodic checks for new handlers (JIRA loads content dynamically)
    setInterval(() => {
      this.processEditableFields(document);
    }, 5000);
  }

  processEditableFields(rootElement) {
    // Find all editable field containers
    const editableFields = rootElement.querySelectorAll 
      ? rootElement.querySelectorAll('[data-component-selector="jira-issue-view-rich-text-inline-edit-view-container"]')
      : [];

    editableFields.forEach(field => {
      this.enhanceEditableField(field);
    });
  }

  enhanceEditableField(editableFieldElement) {
    // Find the parent div with role="presentation"
    const parentDiv = editableFieldElement.closest('[role="presentation"]');
    
    if (!parentDiv) {
      console.log('JIRA UX Enhancer: No parent with role="presentation" found for editable field');
      return;
    }

    // Skip if already enhanced
    if (parentDiv.hasAttribute('data-jira-enhanced-editable')) {
      return;
    }


    // Mark as enhanced
    parentDiv.setAttribute('data-jira-enhanced-editable', 'true');

    // Capture original event handlers before blocking
    const originalHandlers = this.captureOriginalHandlers(parentDiv, editableFieldElement);

    // Block the default onclick behavior
    this.blockEditableFieldClick(parentDiv);

    // Add edit button with original functionality
    this.addEditButton(editableFieldElement, originalHandlers);

    // Add visual indicators
    this.addEditableFieldIndicators(parentDiv);
  }

  blockEditableFieldClick(parentDiv) {
    // Store references to our event blockers so we can remove them temporarily
    const eventBlockers = {};
    
    // Add click event listener with capture to intercept before JIRA's handlers
    const clickBlocker = (event) => {
      // Check if we're bypassing blocking
      if (parentDiv.hasAttribute('data-jira-bypass-blocking')) {
        return; // Let the event through
      }
      
      // Check if we're intentionally triggering the original behavior
      if (parentDiv.hasAttribute('data-jira-triggering-original')) {
        return; // Let the event through
      }
      
      // Skip if click originated from our edit button
      if (event.target.closest('.jira-ux-edit-button')) {
        return;
      }
      
      // Prevent the default inline editing behavior
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    };
    
    eventBlockers.click = clickBlocker;
    parentDiv.addEventListener('click', clickBlocker, { capture: true, passive: false });

    // Also block other mouse events that might trigger editing
    ['mousedown', 'mouseup', 'dblclick'].forEach(eventType => {
      const eventBlocker = (event) => {
        // Check if we're bypassing blocking
        if (parentDiv.hasAttribute('data-jira-bypass-blocking')) {
          return; // Let the event through
        }
        
        // Check if we're intentionally triggering the original behavior
        if (parentDiv.hasAttribute('data-jira-triggering-original')) {
          return; // Let the event through
        }
        
        // Skip if event originated from our edit button
        if (event.target.closest('.jira-ux-edit-button')) {
          return;
        }
        
        if (event.target.closest('[data-component-selector="jira-issue-view-rich-text-inline-edit-view-container"]')) {
          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();
        }
      };
      
      eventBlockers[eventType] = eventBlocker;
      parentDiv.addEventListener(eventType, eventBlocker, { capture: true, passive: false });
    });

    // Store the blockers on the element for later access
    parentDiv._jiraUxEventBlockers = eventBlockers;
  }

  addEditableFieldIndicators(parentDiv) {
    // Add a visual indicator that this field is being controlled by our extension
    parentDiv.style.position = 'relative';
    
    // Add a subtle border to show it's enhanced
    parentDiv.style.border = '1px dashed rgba(0, 82, 204, 0.3)';
    parentDiv.style.borderRadius = '4px';
    
    // Add hover effect for debugging
    parentDiv.addEventListener('mouseenter', () => {
      parentDiv.style.backgroundColor = 'rgba(0, 82, 204, 0.05)';
      // Show edit button on hover
      const editBtn = parentDiv.querySelector('.jira-ux-edit-button');
      if (editBtn) {
        editBtn.style.opacity = '1';
      }
    });
    
    parentDiv.addEventListener('mouseleave', () => {
      parentDiv.style.backgroundColor = '';
      // Hide edit button when not hovering
      const editBtn = parentDiv.querySelector('.jira-ux-edit-button');
      if (editBtn) {
        editBtn.style.opacity = '0.7';
      }
    });
  }

  captureOriginalHandlers(parentDiv, editableFieldElement) {
    // Simplified - we no longer need complex handler capture since we use event simulation
    return {};
  }

  handleSettingUpdate(setting, value) {
    if (setting === 'editButtons') {
      if (value) {
        // Enable edit buttons
        this.enhanceEditableFields();
      } else {
        // Disable edit buttons
        this.removeAllEditButtons();
      }
    }
  }

  handleSettingsReset(settings) {
    // Remove all current enhancements
    this.removeAllEditButtons();
    
    // Apply new settings
    this.applyUserPreferences(settings);
  }

  refreshEnhancements() {
    // Remove and re-add all enhancements
    this.removeAllEditButtons();
    if (this.preferences?.editButtons !== false) {
      this.enhanceEditableFields();
    }
  }

  removeAllEditButtons() {
    // Remove all edit buttons and enhanced styling
    const enhancedFields = document.querySelectorAll('[data-jira-enhanced-editable]');
    enhancedFields.forEach(field => {
      // Remove edit button
      const editButton = field.querySelector('.jira-ux-edit-button');
      if (editButton) {
        editButton.remove();
      }
      
      // Remove enhanced styling
      field.style.position = '';
      field.style.border = '';
      field.style.borderRadius = '';
      field.style.backgroundColor = '';
      
      // Remove enhancement marker
      field.removeAttribute('data-jira-enhanced-editable');
      
      // Remove event blockers
      if (field._jiraUxEventBlockers) {
        Object.keys(field._jiraUxEventBlockers).forEach(eventType => {
          field.removeEventListener(eventType, field._jiraUxEventBlockers[eventType], { capture: true });
        });
        delete field._jiraUxEventBlockers;
      }
    });
  }

  addEditButton(editableFieldElement, originalHandlers) {
    // Create edit button
    const editButton = document.createElement('button');
    editButton.className = 'jira-ux-edit-button';
    editButton.textContent = 'Edit';
    editButton.title = 'Click to edit this field';
    
    // Style the button
    Object.assign(editButton.style, {
      position: 'absolute',
      top: '-24px',
      right: '0px',
      padding: '4px 8px',
      fontSize: '11px',
      fontWeight: '600',
      backgroundColor: '#0052cc',
      color: 'white',
      border: 'none',
      borderRadius: '3px',
      cursor: 'pointer',
      zIndex: '1000',
      opacity: '0.7',
      transition: 'all 0.2s ease',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    });

    // Add hover effects
    editButton.addEventListener('mouseenter', () => {
      editButton.style.opacity = '1';
      editButton.style.transform = 'scale(1.05)';
      editButton.style.backgroundColor = '#0043a8';
    });

    editButton.addEventListener('mouseleave', () => {
      editButton.style.opacity = '0.9';
      editButton.style.transform = 'scale(1)';
      editButton.style.backgroundColor = '#0052cc';
    });

    // Add click handler to trigger original behavior
    editButton.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      
      // Get fresh reference to parent element at click time
      const currentParentDiv = editableFieldElement.closest('[role="presentation"]');
      
      // Temporarily disable our blocking by marking the parent
      currentParentDiv.setAttribute('data-jira-bypass-blocking', 'true');
      
      // Hide the edit button temporarily so it doesn't interfere
      editButton.style.display = 'none';
      
      // Wait a moment, then simulate the complete mouse interaction sequence
      setTimeout(() => {
        const rect = currentParentDiv.getBoundingClientRect();
        const clientX = rect.left + 50;
        const clientY = rect.top + 20;
        
        const eventProps = {
          bubbles: true,
          cancelable: true,
          view: window,
          detail: 1,
          clientX: clientX,
          clientY: clientY,
          button: 0,
          buttons: 1
        };
        
        // Simulate the full mouse interaction sequence that JIRA expects
        const mouseDownEvent = new MouseEvent('mousedown', eventProps);
        const mouseUpEvent = new MouseEvent('mouseup', eventProps);
        const clickEvent = new MouseEvent('click', { ...eventProps, detail: 1 });
        
        currentParentDiv.dispatchEvent(mouseDownEvent);
        
        setTimeout(() => {
          currentParentDiv.dispatchEvent(mouseUpEvent);
          
          setTimeout(() => {
            currentParentDiv.dispatchEvent(clickEvent);
          }, 10);
        }, 10);
        
        // Clean up after a delay to let JIRA process the click
        setTimeout(() => {
          currentParentDiv.removeAttribute('data-jira-bypass-blocking');
          // Don't show the edit button again if JIRA entered edit mode
          if (!currentParentDiv.querySelector('input, textarea, [contenteditable]')) {
            editButton.style.display = '';
          }
        }, 1000);
        
      }, 50);
    }, { capture: true });

    // Find the container to add the button to
    const container = editableFieldElement.closest('[role="presentation"]');
    if (container) {
      container.style.position = 'relative';
      container.appendChild(editButton);
    }
  }
}

// Initialize the enhancer when the page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new JiraEnhancer();
  });
} else {
  new JiraEnhancer();
}