// IMMEDIATE PRELOADER BLOCKER
// Add this script to Webflow Custom Code in <head> section BEFORE any other scripts

(function() {
  'use strict';
  
  // Detect navigation type immediately
  const navigationType = performance.getEntriesByType('navigation')[0]?.type;
  const isHardReload = navigationType === 'reload';
  const referrer = document.referrer;
  const isFromPortfolio = !isHardReload && referrer && (
    referrer.includes('portfolio') || 
    referrer.includes('casestudy') ||
    referrer.includes('oakley') ||
    referrer.includes('dopo')
  );
  
  // If coming from portfolio, immediately hide preloader
  if (isFromPortfolio) {

    
    // Inject CSS immediately
    const style = document.createElement('style');
    style.id = 'immediate-preloader-block';
    style.textContent = `
      .pre-loader, 
      .pre-loader.show {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        transform: translateY(-100vh) !important;
      }
    `;
    
    // Insert at the very beginning of head
    if (document.head) {
      document.head.insertBefore(style, document.head.firstChild);
    } else {
      // If head doesn't exist yet, wait for it
      document.addEventListener('DOMContentLoaded', function() {
        document.head.insertBefore(style, document.head.firstChild);
      });
    }
    
    // Also hide via DOM when available
    const hidePreloader = function() {
      const preloader = document.querySelector('.pre-loader');
      if (preloader) {
        preloader.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important;';
        preloader.setAttribute('data-blocked-by-script', 'true');

      }
    };
    
    // Try to hide immediately
    hidePreloader();
    
    // Also try when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', hidePreloader);
    }
  } else {

  }
})();
