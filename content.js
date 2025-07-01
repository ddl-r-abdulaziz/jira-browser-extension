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
      console.log('JIRA UX Enhancer: Not a JIRA page, skipping enhancements');
      return;
    }

    console.log('JIRA UX Enhancer: JIRA page detected, applying enhancements');
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
  }

  handleDynamicContent(addedNodes) {
    addedNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        this.enhanceElement(node);
      }
    });
  }

  applyEnhancements() {
    this.enhanceIssueViews();
    this.enhanceBoards();
    this.enhanceNavigation();
    this.improveReadability();
    this.enhanceEditableFields();
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
    if (preferences.darkMode) {
      document.body.classList.add('jira-dark-mode');
    }
    if (preferences.compactView) {
      document.body.classList.add('jira-compact-view');
    }
  }

  enhanceEditableFields() {
    // Find and process all editable fields on the page
    this.processEditableFields(document);
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

    console.log('JIRA UX Enhancer: Enhancing editable field', parentDiv);

    // Mark as enhanced
    parentDiv.setAttribute('data-jira-enhanced-editable', 'true');

    // Block the default onclick behavior
    this.blockEditableFieldClick(parentDiv);

    // Add visual indicators
    this.addEditableFieldIndicators(parentDiv);
  }

  blockEditableFieldClick(parentDiv) {
    // Add click event listener with capture to intercept before JIRA's handlers
    parentDiv.addEventListener('click', (event) => {
      console.log('JIRA UX Enhancer: Blocking default edit behavior');
      
      // Prevent the default inline editing behavior
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      
      // Custom behavior can be added here later
      console.log('JIRA UX Enhancer: Custom edit behavior would trigger here');
      
    }, { capture: true, passive: false });

    // Also block other mouse events that might trigger editing
    ['mousedown', 'mouseup', 'dblclick'].forEach(eventType => {
      parentDiv.addEventListener(eventType, (event) => {
        if (event.target.closest('[data-component-selector="jira-issue-view-rich-text-inline-edit-view-container"]')) {
          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();
        }
      }, { capture: true, passive: false });
    });
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
    });
    
    parentDiv.addEventListener('mouseleave', () => {
      parentDiv.style.backgroundColor = '';
    });
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