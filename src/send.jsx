
window.onbeforeunload = function () {

    setTimeout(function() {
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
      }
    
      sessionStorage.clear()
      
        window.scrollTo(-1, 0); // Use touchstart to reset scroll position
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        //scrollToAnchor()
        
        
         
      }, 500)
     
  
  }
  /* 
  window.addEventListener('load', function() {
    setTimeout(function() {
      document.getElementById('clicker-to-hero').click()
    }, 700)
  
  })
   */
  
  
  /*
  window.addEventListener('load', function() {
    scrollToAnchor()
    
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  
    sessionStorage.clear()
    
    //console.log(document.documentElement.scrollTop)
    //console.log(document.body.scrollTop)
  
  
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(function() {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }, 100); // Delay by 100ms or adjust as needed
    });
   
  });
  */
  
  
  
  
  
  /* 
  window.onbeforeunload = function () {
    setTimeout(() => {
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
      }
  
      document.addEventListener('DOMContentLoaded', function() {
        // For Safari and other browsers
        if (document.documentElement.scrollTop !== undefined) {
          document.documentElement.scrollTop = 0; // Reset scroll position for HTML element
        } else if (document.body.scrollTop !== undefined) {
          document.body.scrollTop = 0; // Reset scroll position for body
        } else {
          window.scrollTo(0, 0); // Default reset for window scroll
        }
      });
      */
  
      /* window.scroll({ top: -1, left: 0});
      document.body.scrollTop = 0
      document.documentElement.scrollTop = 0; */
    /*
    }, 10); 
  }
   */
  
  /* window.onbeforeunload = function() {
    //window.scrollTo(0, 0);
    if (document.body.scrollTop !== undefined) {
      document.body.scrollTop = 0; // For Safari and some old browsers
    } else {
      window.scrollTo(0, 0); // For most modern browsers
    }
  }; */
  