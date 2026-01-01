
  function generateParticles(n) {
    let value = `${getRandom(2560)}px ${getRandom(2560)}px #000`;
    for (let i = 2; i <= n; i++) {
      value += `, ${getRandom(2560)}px ${getRandom(2560)}px #000`;
    }
    return value;
  }

  function generateStars(n) {
    let value = `${getRandom(2560)}px ${getRandom(2560)}px #fff`;
    for (let i = 2; i <= n; i++) {
      value += `, ${getRandom(2560)}px ${getRandom(2560)}px #fff`;
    }
    return value;
  }

  function getRandom(max) {
    return Math.floor(Math.random() * max);
  }

  function initBG() {
    // Reduce particle count for better performance
    const particlesSmall = generateParticles(300);
    const particlesMedium = generateParticles(150);
    const particlesLarge = generateParticles(75);
    const particles1 = document.getElementById('particles1');
    const particles2 = document.getElementById('particles2');
    const particles3 = document.getElementById('particles3');

    if (particles1) {
      particles1.style.cssText = `
      width: 1px;
      height: 1px;
      border-radius: 50%;
      box-shadow: ${particlesSmall};
      animation: animStar 50s linear infinite;
      `;
    }

    if (particles2) {
      particles2.style.cssText = `
      width: 1.5px;
      height: 1.5px;
      border-radius: 50%;
      box-shadow: ${particlesMedium};
      animation: animateParticle 100s linear infinite;
      `;
    }

    if (particles3) {
      particles3.style.cssText = `
      width: 2px;
      height: 2px;
      border-radius: 50%;
      box-shadow: ${particlesLarge};
      animation: animateParticle 150s linear infinite;
      `;
    }

    const starsSmall = generateStars(200);
    const starsMedium = generateStars(100);
    const starsLarge = generateStars(50);
    const stars1 = document.getElementById('stars1');
    const stars2 = document.getElementById('stars2');
    const stars3 = document.getElementById('stars3');

    if (stars1) {
      stars1.style.cssText = `
      width: 1px;
      height: 1px;
      border-radius: 50%;
      box-shadow: ${starsSmall};
      `;
    }

    if (stars2) {
      stars2.style.cssText = `
      width: 1.5px;
      height: 1.5px;
      border-radius: 50%;
      box-shadow: ${starsMedium};
      `;
    }

    if (stars3) {
      stars3.style.cssText = `
      width: 2px;
      height: 2px;
      border-radius: 50%;
      box-shadow: ${starsLarge};
      `;
    }
  }

  document.addEventListener('astro:after-swap', initBG);
  initBG();