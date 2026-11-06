/**
 * Portfolio Website Interactions & Animations
 * Candidate: Srinandhini Puralasetti
 * Pure Vanilla JavaScript (No external frameworks)
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------------
     1. PRELOADER
     ------------------------------------------------------------------------ */
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('fade-out');
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 600);
      }, 400);
    });

    // Fallback if load already fired
    if (document.readyState === 'complete') {
      setTimeout(() => {
        preloader.classList.add('fade-out');
      }, 500);
    }
  }

  /* ------------------------------------------------------------------------
     2. DYNAMIC COPYRIGHT YEAR
     ------------------------------------------------------------------------ */
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  /* ------------------------------------------------------------------------
     3. CUSTOM CURSOR (DESKTOP ONLY)
     ------------------------------------------------------------------------ */
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorOutline = document.querySelector('.cursor-outline');

  if (cursorDot && cursorOutline && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    // Smooth outline interpolation
    const renderCursor = () => {
      outlineX += (mouseX - outlineX) * 0.15;
      outlineY += (mouseY - outlineY) * 0.15;
      cursorOutline.style.left = `${outlineX}px`;
      cursorOutline.style.top = `${outlineY}px`;
      requestAnimationFrame(renderCursor);
    };
    requestAnimationFrame(renderCursor);

    // Interactive element hover detection
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, .skill-pill, .pillar-card, .cert-card, .strength-card, .interest-card');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  /* ------------------------------------------------------------------------
     4. AMBIENT PARTICLE CONSTELLATION CANVAS
     ------------------------------------------------------------------------ */
  const canvas = document.getElementById('ambient-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const count = Math.min(Math.floor(width / 25), 45); // Responsive density

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.8 + 0.8,
        color: Math.random() > 0.4 ? 'rgba(212, 175, 55, 0.45)' : 'rgba(56, 189, 248, 0.35)'
      });
    }

    const drawParticles = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(212, 175, 55, ${0.12 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particle points
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      requestAnimationFrame(drawParticles);
    };

    // Only run if not prefers-reduced-motion
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      drawParticles();
    }
  }

  /* ------------------------------------------------------------------------
     5. STICKY NAVBAR & SCROLL SPY
     ------------------------------------------------------------------------ */
  const header = document.getElementById('header');
  const backToTopBtn = document.getElementById('back-to-top');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const handleScroll = () => {
    const scrollY = window.scrollY;

    // Header transition
    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Back to top visibility
    if (scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }

    // ScrollSpy active link highlighting
    let currentSectionId = '';
    sections.forEach((sec) => {
      const secTop = sec.offsetTop - 120;
      const secHeight = sec.offsetHeight;
      if (scrollY >= secTop && scrollY < secTop + secHeight) {
        currentSectionId = sec.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ------------------------------------------------------------------------
     6. RESPONSIVE MOBILE NAVIGATION TOGGLE
     ------------------------------------------------------------------------ */
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close when clicking nav link
    document.querySelectorAll('.nav-link, .btn-nav-resume').forEach((item) => {
      item.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ------------------------------------------------------------------------
     7. ANIMATED TYPING TEXT EFFECT (HERO)
     ------------------------------------------------------------------------ */
  const typingTextEl = document.getElementById('typing-text');
  if (typingTextEl) {
    const roles = [
      'Python Developer',
      'Django Developer',
      'Full-Stack Developer',
      'Software Developer'
    ];

    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    const typeSpeed = 100;
    const deleteSpeed = 45;
    const pauseDelay = 1800;

    const typeRole = () => {
      const currentRole = roles[roleIdx];

      if (isDeleting) {
        typingTextEl.textContent = currentRole.substring(0, charIdx - 1);
        charIdx--;
      } else {
        typingTextEl.textContent = currentRole.substring(0, charIdx + 1);
        charIdx++;
      }

      let timeout = isDeleting ? deleteSpeed : typeSpeed;

      if (!isDeleting && charIdx === currentRole.length) {
        timeout = pauseDelay;
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        timeout = 400;
      }

      setTimeout(typeRole, timeout);
    };

    setTimeout(typeRole, 600);
  }

  /* ------------------------------------------------------------------------
     8. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
     ------------------------------------------------------------------------ */
  const revealElements = document.querySelectorAll('.reveal-fade-up, .reveal-fade-left, .reveal-fade-right');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.05,
      rootMargin: '0px 0px 80px 0px'
    });

    revealElements.forEach((el) => observer.observe(el));
  } else {
    // Fallback if no observer
    revealElements.forEach((el) => el.classList.add('revealed'));
  }

  /* ------------------------------------------------------------------------
     9. TECHNICAL SKILLS CATEGORY FILTER
     ------------------------------------------------------------------------ */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-category-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterValue = btn.getAttribute('data-filter');

      skillCards.forEach((card) => {
        const cardCat = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCat === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  /* ------------------------------------------------------------------------
     10. INTERACTIVE ATS PROJECT SIMULATOR MODAL
     ------------------------------------------------------------------------ */
  const demoModal = document.getElementById('demo-modal');
  const openModalBtn = document.getElementById('btn-open-demo-modal');
  const closeModalBtn = document.getElementById('btn-close-demo-modal');
  const roleSelect = document.getElementById('demo-role-select');
  const scoreVal = document.getElementById('demo-score-val');
  const verdictEl = document.getElementById('demo-verdict');
  const matchedPillsContainer = document.getElementById('demo-matched-pills');
  const missingPillsContainer = document.getElementById('demo-missing-pills');

  // Simulated ATS scoring dictionary based on real skills
  const roleScenarios = {
    'python-django': {
      score: '94%',
      verdict: '<i class="fa-solid fa-circle-check" aria-hidden="true"></i> High Match: Ideal Backend Fit',
      matched: ['Python', 'Django', 'MySQL', 'DBMS', 'OOP', 'Git', 'Data Structures'],
      missing: ['+ Unit Testing', '+ Celery']
    },
    'fullstack': {
      score: '88%',
      verdict: '<i class="fa-solid fa-circle-check" aria-hidden="true"></i> Strong Match: Candidate Meets Core Stack',
      matched: ['Python', 'Django', 'MySQL', 'HTML', 'CSS', 'Bootstrap', 'JavaScript', 'Git'],
      missing: ['+ Docker', '+ RESTful APIs']
    },
    'database': {
      score: '85%',
      verdict: '<i class="fa-solid fa-circle-check" aria-hidden="true"></i> Good Match: Solid SQL & Schema Foundations',
      matched: ['MySQL', 'DBMS', 'SQL', 'Python', 'Relational Normalization', 'Oracle Course'],
      missing: ['+ PostgreSQL', '+ Query Index Profiling']
    }
  };

  const updateDemoSimulation = (roleKey) => {
    const data = roleScenarios[roleKey] || roleScenarios['python-django'];
    if (scoreVal) scoreVal.textContent = data.score;
    if (verdictEl) verdictEl.innerHTML = data.verdict;

    if (matchedPillsContainer) {
      matchedPillsContainer.innerHTML = data.matched
        .map((skill) => `<span class="pill hit">${skill}</span>`)
        .join('');
    }

    if (missingPillsContainer) {
      missingPillsContainer.innerHTML = data.missing
        .map((skill) => `<span class="pill miss">${skill}</span>`)
        .join('');
    }
  };

  if (openModalBtn && demoModal) {
    openModalBtn.addEventListener('click', () => {
      demoModal.classList.add('active');
      demoModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (roleSelect) updateDemoSimulation(roleSelect.value);
    });

    const closeModal = () => {
      demoModal.classList.remove('active');
      demoModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

    demoModal.addEventListener('click', (e) => {
      if (e.target === demoModal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && demoModal.classList.contains('active')) closeModal();
    });

    if (roleSelect) {
      roleSelect.addEventListener('change', (e) => {
        updateDemoSimulation(e.target.value);
      });
    }
  }

  /* ------------------------------------------------------------------------
     11. PROFESSIONAL CONTACT FORM (AUTHENTIC EMAIL CLIENT INTEGRATION)
     ------------------------------------------------------------------------ */
  const contactForm = document.getElementById('portfolio-contact-form');
  const nameInput = document.getElementById('sender-name');
  const emailInput = document.getElementById('sender-email');
  const subjectInput = document.getElementById('sender-subject');
  const messageInput = document.getElementById('sender-message');
  const feedbackAlert = document.getElementById('form-feedback');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const subjectError = document.getElementById('subject-error');
  const messageError = document.getElementById('message-error');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateForm = () => {
    let isValid = true;

    // Reset errors
    if (nameError) nameError.textContent = '';
    if (emailError) emailError.textContent = '';
    if (subjectError) subjectError.textContent = '';
    if (messageError) messageError.textContent = '';

    // Name Validation
    if (!nameInput.value.trim()) {
      if (nameError) nameError.textContent = 'Please enter your name.';
      isValid = false;
    }

    // Email Validation
    if (!emailInput.value.trim()) {
      if (emailError) emailError.textContent = 'Please enter your email address.';
      isValid = false;
    } else if (!emailRegex.test(emailInput.value.trim())) {
      if (emailError) emailError.textContent = 'Please provide a valid email address.';
      isValid = false;
    }

    // Subject Validation
    if (!subjectInput.value.trim()) {
      if (subjectError) subjectError.textContent = 'Please enter a subject.';
      isValid = false;
    }

    // Message Validation
    if (!messageInput.value.trim()) {
      if (messageError) messageError.textContent = 'Please enter your message.';
      isValid = false;
    } else if (messageInput.value.trim().length < 10) {
      if (messageError) messageError.textContent = 'Message should contain at least 10 characters.';
      isValid = false;
    }

    return isValid;
  };

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const subject = subjectInput.value.trim();
      const message = messageInput.value.trim();

      const recipient = 'purlachittinandhini@gmail.com';
      const mailtoSubject = encodeURIComponent(`[Portfolio Inquiry] ${subject} - From ${name}`);
      const mailtoBody = encodeURIComponent(
        `Hello Srinandhini,\n\n${message}\n\n---\nSender Details:\nName: ${name}\nEmail: ${email}\nSent via Portfolio Contact Form`
      );

      const mailtoUrl = `mailto:${recipient}?subject=${mailtoSubject}&body=${mailtoBody}`;

      // Open email client
      window.location.href = mailtoUrl;

      // Provide clear, honest in-page feedback
      if (feedbackAlert) {
        feedbackAlert.className = 'form-feedback-alert success';
        feedbackAlert.style.display = 'block';
        feedbackAlert.innerHTML = `
          <strong><i class="fa-solid fa-circle-check" aria-hidden="true"></i> Message Prepared!</strong><br>
          Your default email application has been launched to send this directly to <strong>${recipient}</strong>.<br>
          <small style="display:inline-block; margin-top: 6px;">If your email client didn't open automatically, you can directly email: <a href="mailto:${recipient}" style="text-decoration:underline; color:#fff;">${recipient}</a></small>
        `;
      }
    });

    // Real-time error clearance on input
    [nameInput, emailInput, subjectInput, messageInput].forEach((input) => {
      if (input) {
        input.addEventListener('input', () => {
          const errField = document.getElementById(`${input.name}-error`);
          if (errField) errField.textContent = '';
          if (feedbackAlert) feedbackAlert.style.display = 'none';
        });
      }
    });
  }

});
