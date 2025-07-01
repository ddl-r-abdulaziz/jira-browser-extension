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
    // Create a synthetic event to trigger original behavior
    const originalHandlers = {
      triggerOriginalClick: () => {
        console.log('JIRA UX Enhancer: Triggering original edit behavior');
        
        // Remove our blocking listeners temporarily
        const tempDiv = parentDiv.cloneNode(true);
        parentDiv.parentNode.insertBefore(tempDiv, parentDiv);
        parentDiv.style.display = 'none';
        
        // Simulate click on the original element structure
        const clickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        });
        
        // Find the editable element in the temp div and click it
        const tempEditableElement = tempDiv.querySelector('[data-component-selector="jira-issue-view-rich-text-inline-edit-view-container"]');
        if (tempEditableElement) {
          setTimeout(() => {
            tempEditableElement.dispatchEvent(clickEvent);
            // Clean up after a short delay
            setTimeout(() => {
              if (tempDiv.parentNode) {
                tempDiv.parentNode.removeChild(tempDiv);
                parentDiv.style.display = '';
              }
            }, 100);
          }, 50);
        }
      }
    };

    return originalHandlers;
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
      top: '4px',
      right: '4px',
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
      
      console.log('JIRA UX Enhancer: Edit button clicked');
      originalHandlers.triggerOriginalClick();
    }, { capture: true });

    // Find the container to add the button to
    const container = editableFieldElement.closest('[role="presentation"]');
    if (container) {
      container.style.position = 'relative';
      container.appendChild(editButton);
      console.log('JIRA UX Enhancer: Edit button added');
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