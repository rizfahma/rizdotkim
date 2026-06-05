document.addEventListener('DOMContentLoaded', () => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll('.animate-section');
  animatedElements.forEach((el) => {
    el.classList.add('animate-on-scroll');
    el.classList.remove('animate-section');
    observer.observe(el);
  });

  const staggerContainers = document.querySelectorAll('.stagger-children');
  staggerContainers.forEach((container) => {
    const children = container.querySelectorAll('.animate-on-scroll');
    children.forEach((child) => observer.observe(child));
  });
});
