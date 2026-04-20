document.addEventListener("DOMContentLoaded", () => {
  // --- EFFECT 1: GLOBAL NEON PARTICLE CURSOR ---
  const cursorCanvas = document.getElementById("cursor-canvas");
  const cctx = cursorCanvas.getContext("2d", { alpha: true });
  let cWidth = window.innerWidth;
  let cHeight = window.innerHeight;
  cursorCanvas.width = cWidth;
  cursorCanvas.height = cHeight;

  window.addEventListener("resize", () => {
    cWidth = window.innerWidth;
    cHeight = window.innerHeight;
    cursorCanvas.width = cWidth;
    cursorCanvas.height = cHeight;
  });

  const cursorParticles = [];
  let mouseX = cWidth / 2;
  let mouseY = cHeight / 2;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Add particle on mousemove
    for(let i=0; i<2; i++) {
      cursorParticles.push({
        x: mouseX,
        y: mouseY,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: 1,
        color: `hsl(70, 100%, ${50 + Math.random()*20}%)` // primary #E8FF00 range
      });
    }
  });

  function animateCursor() {
    cctx.clearRect(0, 0, cWidth, cHeight);
    
    for (let i = 0; i < cursorParticles.length; i++) {
        let p = cursorParticles[i];
        
        cctx.beginPath();
        cctx.arc(p.x, p.y, p.life * 4, 0, Math.PI * 2);
        cctx.fillStyle = p.color;
        cctx.globalAlpha = p.life;
        cctx.fill();
        
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.04;
    }
    
    // Draw the core glowing dot at actual cursor
    cctx.beginPath();
    cctx.arc(mouseX, mouseY, 3, 0, Math.PI * 2);
    cctx.fillStyle = "#E8FF00";
    cctx.globalAlpha = 1;
    cctx.shadowBlur = 10;
    cctx.shadowColor = "#E8FF00";
    cctx.fill();
    cctx.shadowBlur = 0; // reset

    // Remove dead particles
    while(cursorParticles.length > 0 && cursorParticles[0].life <= 0) {
        cursorParticles.shift();
    }
    
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
  // ---------------------------------------------

  // Force autoplay for videos if blocked by browser policies (especially Safari)
  const videos = document.querySelectorAll("video");
  videos.forEach(video => {
    // Safari strict muted requirement
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute("playsinline", "");
    
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.log("Video autoplay prevented. Waiting for interaction...", error);
        // Fallback: play on first user interaction or scroll
        const startVideo = () => {
          video.play();
          window.removeEventListener("scroll", startVideo);
          window.removeEventListener("touchstart", startVideo);
          document.removeEventListener("click", startVideo);
        };
        window.addEventListener("scroll", startVideo, { once: true });
        window.addEventListener("touchstart", startVideo, { once: true });
        document.addEventListener("click", startVideo, { once: true });
      });
    }
  });

  // GSAP Plugins
  gsap.registerPlugin(ScrollTrigger);

  // 1. Navbar Glass Effect on Scroll
  const navbar = document.querySelector(".navbar");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // 2. Hero Text Staggered Animation
  const heroWords = document.querySelectorAll(".hero-title .word");
  gsap.to(heroWords, {
    y: 0,
    duration: 1,
    ease: "power4.out",
    stagger: 0.4,
    delay: 0.2
  });

  // Fade in hero elements
  gsap.fromTo(".hero-label, .hero-subtext, .hero-actions", 
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 1, stagger: 0.2, delay: 1, ease: "power3.out" }
  );

  // 3. Section Headings Animation
  const sectionHeaders = document.querySelectorAll(".section-header");
  sectionHeaders.forEach((header) => {
    gsap.fromTo(header, 
      { opacity: 0, y: 50 },
      {
        scrollTrigger: {
          trigger: header,
          start: "top 80%",
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out"
      }
    );
  });

  // 4. Stats Counter Animation
  const stats = document.querySelectorAll(".stat-number");
  stats.forEach((stat) => {
    const target = parseInt(stat.getAttribute("data-target"));
    ScrollTrigger.create({
      trigger: stat,
      start: "top 85%",
      once: true,
      onEnter: () => {
        let current = 0;
        const duration = 1500; // ms
        const increment = target / (duration / 16); // 60fps
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            stat.innerText = target;
            clearInterval(timer);
          } else {
            stat.innerText = Math.floor(current);
          }
        }, 16);
      }
    });
  });

  // 5. Program Cards Stagger
  gsap.fromTo(".program-card", 
    { opacity: 0, y: 50 },
    {
      scrollTrigger: {
        trigger: ".programs-grid",
        start: "top 80%"
      },
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out"
    }
  );

  // 6. Scroll-Zoom Video Section
  const zoomSection = document.querySelector(".scroll-zoom-section");
  const zoomVideo = document.querySelector(".zoom-video-container");
  const zoomTitle = document.querySelector(".zoom-title");
  
  // Create timeline for smooth zooming
  let tlZoom = gsap.timeline({
    scrollTrigger: {
      trigger: zoomSection,
      start: "top top",
      end: "+=100%", // Expand over 100vh scrolling
      scrub: 1,
      pin: false
    }
  });

  tlZoom.to(zoomVideo, {
    width: "100%",
    height: "100vh",
    borderRadius: "0px",
    ease: "none"
  })
  .to(zoomTitle, {
    opacity: 0,
    ease: "none"
  }, "<"); // animate together

  // 7. Testimonial auto-scroll (CSS handles snap, we just add subtle hover effects in CSS, no JS needed)

  // 8. CTA Banner Particle Canvas
  const canvas = document.getElementById("cta-canvas");
  const ctx = canvas.getContext("2d");
  let width, height;
  let particles = [];

  function initCanvas() {
    const banner = document.querySelector(".cta-banner");
    width = canvas.width = banner.offsetWidth;
    height = canvas.height = banner.offsetHeight;
    particles = [];
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2 + 1,
        dx: (Math.random() - 0.5) * 1,
        dy: (Math.random() - 0.5) * 1,
        alpha: Math.random() * 0.5 + 0.1
      });
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(232, 255, 0, ${p.alpha})`; // primary accent
      ctx.fill();

      // move
      p.x += p.dx;
      p.y += p.dy;

      // bounce
      if (p.x < 0 || p.x > width) p.dx *= -1;
      if (p.y < 0 || p.y > height) p.dy *= -1;
    });
    requestAnimationFrame(drawParticles);
  }

  initCanvas();
  drawParticles();
  window.addEventListener("resize", initCanvas);

  // Smooth Scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if(targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if(targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Hamburger menu toggle for mobile
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  if(hamburger) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }
});
