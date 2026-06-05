(function() {
  const header = document.getElementById("header");
  if (!header) return;
  
  // Use requestAnimationFrame to batch scroll reads with writes
  let rafId = null;
  let lastScrollY = -1;
  
  function onScroll() {
    // Skip if already in animation frame or scroll position unchanged
    if (rafId) return;
    const currentScrollY = window.scrollY;
    if (currentScrollY === lastScrollY) return;
    
    rafId = requestAnimationFrame(() => {
      rafId = null;
      lastScrollY = currentScrollY;
      
      // Batch all class modifications together
      if (currentScrollY > 0) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    });
  }
  
  // Initial check deferred to after first paint
  requestAnimationFrame(() => {
    if (window.scrollY > 0) {
      header.classList.add("scrolled");
    }
  });
  
  document.addEventListener("scroll", onScroll, { passive: true });
})();
