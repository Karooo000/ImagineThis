
export default function Scroll(){

    console.log("scroll tester 6");
    window.onbeforeunload = function () {
      // Only handle natural navigation, not refresh
      if (
        !window.performance.navigation ||
        window.performance.navigation.type !== 1
      ) {
        if ("scrollRestoration" in history) {
          history.scrollRestoration = "manual";
        }
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "instant",
        });
      }
    };
    
    // Handle initial page load
    window.addEventListener("load", function () {
      // Check if this is a fresh navigation (not refresh)
      if (
        !window.performance.navigation ||
        window.performance.navigation.type !== 1
      ) {
        const checkPreloader = setInterval(() => {
          const preloader = document.querySelector(".preload-new");
    
          // Wait until preloader is no longer active
          if (!preloader || !preloader.classList.contains("preload-new-active")) {
            clearInterval(checkPreloader);
    
            setTimeout(() => {
              // Respect the existing scroll snap while still ensuring top position
              window.scrollTo({
                top: 0,
                left: 0,
                behavior: "instant",
              });
            }, 100); // Small delay after preloader
          }
        }, 10);
      }
    });
}
