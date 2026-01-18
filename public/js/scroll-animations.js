// Intersection Observer for scroll animations
document.addEventListener('DOMContentLoaded', () => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Stop observing after element is visible
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all elements with the animate-on-scroll class
  const animatedElements = document.querySelectorAll('.animate-section');
  animatedElements.forEach((el) => {
    el.classList.add('animate-on-scroll');
    el.classList.remove('animate-section');
    observer.observe(el);
  });

  // Add smooth parallax effect to hero elements
  const heroElements = document.querySelectorAll('.animate-fade-in, .animate-slide-up, .animate-slide-up-delayed');
  
  const handleScroll = () => {
    const scrolled = window.pageYOffset;
    const parallax = scrolled * 0.5;
    
    heroElements.forEach((el, index) => {
      if (scrolled < window.innerHeight) {
        el.style.transform = `translateY(${parallax * (0.5 + index * 0.1)}px)`;
        el.style.opacity = 1 - (scrolled / (window.innerHeight * 1.5));
      }
    });
  };

  // Throttle scroll event
  let ticking = false;
  const requestTick = () => {
    if (!ticking) {
      window.requestAnimationFrame(handleScroll);
      ticking = true;
      setTimeout(() => { ticking = false; }, 100);
    }
  };

  window.addEventListener('scroll', requestTick);
});