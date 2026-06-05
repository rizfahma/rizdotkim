(function() {
  function animate() {
    const animateElements = document.querySelectorAll('.animate');
    
    // Use IntersectionObserver for more efficient animation triggering
    // Only animate elements that are visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    animateElements.forEach((element, index) => {
      // Add staggered delay for visual effect
      setTimeout(() => {
        observer.observe(element);
      }, index * 100);
    });
  }
  
  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', animate);
  } else {
    animate();
  }
  
  // Re-run after Astro page swaps (for view transitions)
  document.addEventListener('astro:after-swap', animate);
})();