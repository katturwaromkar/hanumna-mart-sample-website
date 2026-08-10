/* ==========================================================================
   SHREE HANUMAN SUPER MARKET - Main Interactivity Script
   Sticky navbar, stat counters, carousel, accordion, contact form feedback
   Owner Contact: 7083568189
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Glass Navbar on Scroll
  const header = document.getElementById('mainHeader');
  const scrollTopBtn = document.getElementById('scrollTopBtn');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    if (window.scrollY > 400) {
      scrollTopBtn?.classList.add('visible');
    } else {
      scrollTopBtn?.classList.remove('visible');
    }
  });

  // Scroll to Top Click
  scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // 2. Mobile Menu Navigation Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
      });
    });
  }

  // 3. Scroll Reveal Animation using IntersectionObserver
  const revealElements = document.querySelectorAll('.reveal');
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => revealObserver.observe(el));

  // 4. Animated Number Counters
  const counterElements = document.querySelectorAll('.counter');
  let counterTriggered = false;

  const countUp = () => {
    counterElements.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const duration = 2000;
      const increment = Math.ceil(target / (duration / 16));

      let current = 0;
      const updateCount = () => {
        current += increment;
        if (current < target) {
          counter.innerText = current.toLocaleString('en-IN');
          requestAnimationFrame(updateCount);
        } else {
          counter.innerText = target.toLocaleString('en-IN') + '+';
        }
      };
      updateCount();
    });
  };

  // Trigger counters on visibility
  const statsSection = document.getElementById('heroStats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !counterTriggered) {
        counterTriggered = true;
        countUp();
      }
    }, { threshold: 0.5 });
    statsObserver.observe(statsSection);
  }

  // 5. Testimonials Sliding Carousel
  const track = document.getElementById('testimonialTrack');
  const slides = document.querySelectorAll('.testimonial-card');
  const nextBtn = document.getElementById('nextTestimonial');
  const prevBtn = document.getElementById('prevTestimonial');
  const dotsContainer = document.getElementById('carouselDots');
  let currentIndex = 0;
  let autoplayInterval;

  if (track && slides.length > 0) {
    // Build Dots
    slides.forEach((_, idx) => {
      const dot = document.createElement('span');
      dot.classList.add('dot');
      if (idx === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(idx));
      dotsContainer?.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    const updateCarousel = () => {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });
    };

    const goToSlide = (index) => {
      currentIndex = index;
      updateCarousel();
      resetAutoplay();
    };

    const nextSlide = () => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateCarousel();
    };

    const prevSlide = () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateCarousel();
    };

    nextBtn?.addEventListener('click', () => {
      nextSlide();
      resetAutoplay();
    });

    prevBtn?.addEventListener('click', () => {
      prevSlide();
      resetAutoplay();
    });

    const startAutoplay = () => {
      autoplayInterval = setInterval(nextSlide, 5000);
    };

    const resetAutoplay = () => {
      clearInterval(autoplayInterval);
      startAutoplay();
    };

    startAutoplay();
  }

  // 6. FAQ Accordion Toggle
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
      });

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // 7. Contact Form Handling
  const contactForm = document.getElementById('wholesaleContactForm');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('formName').value.trim();
    const phone = document.getElementById('formPhone').value.trim();
    const message = document.getElementById('formMessage').value.trim();

    if (!name || !phone) {
      alert('Please provide your name and phone number so Jitendra Bhanwarlal Unecha can reach out to you.');
      return;
    }

    const encoded = encodeURIComponent(`Hello Jitendra Bhanwarlal Unecha,\nMy Name: ${name}\nPhone: ${phone}\nEnquiry: ${message}`);
    const directWhatsApp = `https://wa.me/917083568189?text=${encoded}`;

    if (confirm(`Thank you ${name}! Would you like to launch WhatsApp immediately to send this enquiry to Jitendra Bhanwarlal Unecha?`)) {
      window.open(directWhatsApp, '_blank');
    } else {
      alert(`Thank you ${name}. Your message has been prepared for Shree Hanuman Super Market!`);
    }

    contactForm.reset();
  });

  // 8. Category Horizontal Auto-Scroll Carousel
  const scrollWrapper = document.getElementById('categoriesScrollWrapper');
  const catPrevBtn = document.getElementById('catPrevBtn');
  const catNextBtn = document.getElementById('catNextBtn');
  let autoScrollInterval = null;
  let isUserInteracting = false;

  if (scrollWrapper) {
    const cardScrollAmount = 330; // approx 1 card width + gap

    const runAutoScroll = () => {
      if (autoScrollInterval) clearInterval(autoScrollInterval);
      autoScrollInterval = setInterval(() => {
        if (isUserInteracting) return;

        // Reset scroll to start if reached the end
        if (scrollWrapper.scrollLeft + scrollWrapper.clientWidth >= scrollWrapper.scrollWidth - 15) {
          scrollWrapper.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollWrapper.scrollBy({ left: 1.5, behavior: 'auto' });
        }
      }, 30);
    };

    // Pause on hover or touch interaction
    scrollWrapper.addEventListener('mouseenter', () => { isUserInteracting = true; });
    scrollWrapper.addEventListener('mouseleave', () => { isUserInteracting = false; });
    scrollWrapper.addEventListener('touchstart', () => { isUserInteracting = true; }, { passive: true });
    scrollWrapper.addEventListener('touchend', () => { isUserInteracting = false; });

    // Arrow Nav Buttons
    catPrevBtn?.addEventListener('click', () => {
      if (scrollWrapper.scrollLeft <= 5) {
        scrollWrapper.scrollTo({ left: scrollWrapper.scrollWidth, behavior: 'smooth' });
      } else {
        scrollWrapper.scrollBy({ left: -cardScrollAmount, behavior: 'smooth' });
      }
    });

    catNextBtn?.addEventListener('click', () => {
      if (scrollWrapper.scrollLeft + scrollWrapper.clientWidth >= scrollWrapper.scrollWidth - 15) {
        scrollWrapper.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollWrapper.scrollBy({ left: cardScrollAmount, behavior: 'smooth' });
      }
    });

    runAutoScroll();
  }

  // 9. About Section Interactive Tab Switcher
  const aboutTabBtns = document.querySelectorAll('.about-tab-btn');
  const aboutTabPanels = document.querySelectorAll('.about-tab-panel');

  aboutTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      aboutTabBtns.forEach(b => b.classList.remove('active'));
      aboutTabPanels.forEach(p => {
        p.classList.remove('active');
        p.style.display = 'none';
      });

      btn.classList.add('active');
      const activePanel = document.getElementById(targetTab);
      if (activePanel) {
        activePanel.style.display = 'block';
        setTimeout(() => activePanel.classList.add('active'), 20);
      }
    });
  });

  // 10. Left Floating Color Theme Selector Widget
  const themeWidget = document.getElementById('themeSwitcherWidget');
  const themeTriggerBtn = document.getElementById('themeTriggerBtn');
  const themeCloseBtn = document.getElementById('themeCloseBtn');
  const themeOptionBtns = document.querySelectorAll('.theme-option-btn');
  const availableThemes = [
    'theme-emerald', 'theme-ocean', 'theme-amber', 'theme-purple',
    'theme-dark', 'theme-crimson', 'theme-teal', 'theme-gold', 'theme-indigo'
  ];

  const applyColorTheme = (themeName) => {
    availableThemes.forEach(cls => document.body.classList.remove(cls));
    document.body.classList.add(themeName);

    themeOptionBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-theme') === themeName);
    });

    try {
      localStorage.setItem('vb_theme', themeName);
    } catch (e) {
      console.warn('localStorage disabled or unavailable', e);
    }
  };

  // Load saved theme or fallback to default purple (Monica screenshot theme)
  let savedTheme = 'theme-purple';
  try {
    savedTheme = localStorage.getItem('vb_theme') || 'theme-purple';
  } catch (e) {}
  applyColorTheme(savedTheme);

  // Widget Toggle Events
  themeTriggerBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    themeWidget?.classList.toggle('open');
  });

  themeCloseBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    themeWidget?.classList.remove('open');
  });

  // Select Option Click
  themeOptionBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const theme = btn.getAttribute('data-theme');
      if (theme) {
        applyColorTheme(theme);
      }
    });
  });

  // Click outside to close drawer
  document.addEventListener('click', (e) => {
    if (themeWidget && !themeWidget.contains(e.target)) {
      themeWidget.classList.remove('open');
    }
  });
});

