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

  // 3. Instant Reveal for all sections (No blank screen delays)
  const revealElements = document.querySelectorAll('.reveal');
  revealElements.forEach(el => el.classList.add('revealed'));

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

  // 7. Interactive Grocery Enquiry Form Handling
  const enquirySelect = document.getElementById('enquiryProductSelect');
  const enquiryQtyInput = document.getElementById('enquiryProductQty');
  const addEnquiryBtn = document.getElementById('addEnquiryItemBtn');
  const enquiryListContainer = document.getElementById('enquirySelectedItemsList');
  const contactForm = document.getElementById('wholesaleContactForm');

  let selectedEnquiryItems = [];

  // Populate Dropdown from productsData
  if (enquirySelect && typeof productsData !== 'undefined') {
    productsData.forEach(prod => {
      const opt = document.createElement('option');
      opt.value = `${prod.name} (${prod.weight})`;
      opt.textContent = `${prod.name} - ₹${prod.price}/${prod.unit} (${prod.weight})`;
      enquirySelect.appendChild(opt);
    });

    const customOpt = document.createElement('option');
    customOpt.value = "Custom Item (Mentioned in Notes)";
    customOpt.textContent = "➕ Other / Custom Item (Specify in Notes)";
    enquirySelect.appendChild(customOpt);
  }

  // Render Selected Items Tags
  const renderEnquiryItems = () => {
    if (!enquiryListContainer) return;
    if (selectedEnquiryItems.length === 0) {
      enquiryListContainer.innerHTML = `<div class="enquiry-empty-note">No items added yet. Choose a product above and click "+ Add Item".</div>`;
      return;
    }

    enquiryListContainer.innerHTML = selectedEnquiryItems.map((item, idx) => `
      <div class="enquiry-item-tag">
        <span>${item.name} &times; ${item.qty}</span>
        <button type="button" class="remove-tag-btn" onclick="removeEnquiryItem(${idx})" title="Remove item">&times;</button>
      </div>
    `).join('');
  };

  // Add Item Click
  addEnquiryBtn?.addEventListener('click', () => {
    const selectedVal = enquirySelect?.value;
    const qty = parseInt(enquiryQtyInput?.value, 10) || 1;

    if (!selectedVal) {
      alert('Please select a product from the dropdown first.');
      return;
    }

    // Check if already added
    const existingIdx = selectedEnquiryItems.findIndex(i => i.name === selectedVal);
    if (existingIdx > -1) {
      selectedEnquiryItems[existingIdx].qty += qty;
    } else {
      selectedEnquiryItems.push({ name: selectedVal, qty: qty });
    }

    enquirySelect.value = '';
    enquiryQtyInput.value = '1';
    renderEnquiryItems();
  });

  // Global helper to remove enquiry tag
  window.removeEnquiryItem = function(index) {
    selectedEnquiryItems.splice(index, 1);
    renderEnquiryItems();
  };

  // Submit Enquiry
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('formName').value.trim();
    const phone = document.getElementById('formPhone').value.trim();
    const notes = document.getElementById('formNotes')?.value.trim() || '';

    if (!name || !phone) {
      alert('Please provide your name and phone number so Jitendra Bhanwarlal Unecha can reach out to you.');
      return;
    }

    if (selectedEnquiryItems.length === 0 && !notes) {
      alert('Please select at least one product or add notes specifying required items.');
      return;
    }

    // Professional WhatsApp Message Format (No extract/extra decoration)
    let msg = `Grocery Enquiry - Shree Hanuman Super Market\n\n`;
    msg += `Customer Details:\n`;
    msg += `Name: ${name}\n`;
    msg += `Phone: ${phone}\n\n`;

    if (selectedEnquiryItems.length > 0) {
      msg += `Requested Items:\n`;
      selectedEnquiryItems.forEach((item, index) => {
        msg += `${index + 1}. ${item.name} - Quantity: ${item.qty}\n`;
      });
      msg += `\n`;
    }

    if (notes) {
      msg += `Additional Notes:\n${notes}\n\n`;
    }

    msg += `Please share current rates and availability.`;

    const encoded = encodeURIComponent(msg);
    const directWhatsApp = `https://wa.me/917083568189?text=${encoded}`;

    if (confirm(`Thank you ${name}! Would you like to launch WhatsApp to send your enquiry to owner Jitendra Bhanwarlal Unecha?`)) {
      window.open(directWhatsApp, '_blank');
    }

    selectedEnquiryItems = [];
    renderEnquiryItems();
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

/* ==========================================================================
   Comprehensive Anti-Zoom Protection (Prevents zoom in & zoom out on all devices)
   ========================================================================== */
(function setupAntiZoomProtection() {
  // 1. Prevent Multi-touch / Pinch-to-zoom on touch screens
  document.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches.length > 1) {
      e.preventDefault();
    }
  }, { passive: false });

  document.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches.length > 1) {
      e.preventDefault();
    }
  }, { passive: false });

  // 2. Prevent iOS Safari Gesture Zooming (Pinch in/out)
  ['gesturestart', 'gesturechange', 'gestureend'].forEach((eventName) => {
    document.addEventListener(eventName, (e) => {
      e.preventDefault();
    }, { passive: false });
  });

  // 3. Prevent Desktop Trackpad & Mouse Wheel Zoom (Ctrl/Cmd + Wheel)
  document.addEventListener('wheel', (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
    }
  }, { passive: false });

  // 4. Prevent Keyboard Shortcut Zooming (Ctrl/Cmd + '+', '-', '=', '0', Numpad +, Numpad -)
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
      const zoomKeys = ['+', '-', '=', '0', 'NumpadAdd', 'NumpadSubtract', 'Numpad0'];
      const keyCodes = [187, 189, 107, 109, 48, 96, 61, 173];
      if (zoomKeys.includes(e.key) || zoomKeys.includes(e.code) || keyCodes.includes(e.keyCode)) {
        e.preventDefault();
      }
    }
  }, { passive: false });

  // 5. Prevent Double-Tap Zooming on Mobile Touch
  let lastTouchEndTime = 0;
  document.addEventListener('touchend', (e) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTouchEndTime;
    if (tapLength < 300 && tapLength > 0) {
      const target = e.target;
      const isInteractive = target && target.closest && target.closest('input, textarea, select, button, a, label, [role="button"]');
      if (!isInteractive) {
        e.preventDefault();
      }
    }
    lastTouchEndTime = currentTime;
  }, { passive: false });
})();

/* ==========================================================================
   ADMIN ORDERS DASHBOARD MODAL CONTROL
   ========================================================================== */
window.openAdminOrdersModal = async function() {
  const modal = document.getElementById('adminOrdersModal');
  const container = document.getElementById('adminOrdersListContainer');
  if (!modal || !container) return;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  container.innerHTML = `<div style="padding:2rem; text-align:center; color:var(--text-secondary);">🔄 Loading live placed orders from Supabase PostgreSQL database...</div>`;

  if (window.CloudDB && typeof window.CloudDB.fetchOrders === 'function') {
    const ordersList = await window.CloudDB.fetchOrders();
    if (Array.isArray(ordersList) && ordersList.length > 0) {
      container.innerHTML = ordersList.map(ord => {
        const items = ord.order_items || [];
        const itemsHtml = items.map(item => `
          <div style="font-size:0.84rem; display:flex; justify-content:space-between; padding:0.25rem 0; border-bottom:1px dashed var(--border-color);">
            <span>${item.product_name} (${item.weight || ''}) &times; ${item.quantity}</span>
            <strong>₹${item.subtotal}</strong>
          </div>
        `).join('');

        const formattedDate = new Date(ord.created_at).toLocaleString('en-IN', {
          dateStyle: 'medium',
          timeStyle: 'short'
        });

        return `
          <div style="background:#FFF8F3; border:1px solid var(--border-hover); border-radius:10px; padding:1rem; margin-bottom:1rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem; flex-wrap:wrap; gap:0.5rem;">
              <strong style="color:var(--primary-color); font-size:0.95rem;">${ord.order_number}</strong>
              <span style="font-size:0.75rem; background:#FFFFFF; padding:0.2rem 0.5rem; border-radius:12px; border:1px solid var(--border-color); color:var(--text-secondary);">${formattedDate}</span>
            </div>
            <div style="font-size:0.88rem; font-weight:600; color:var(--text-primary);">${ord.customer_name} (${ord.customer_phone})</div>
            <div style="font-size:0.82rem; color:var(--text-secondary); margin-bottom:0.5rem;">Option: <strong>${ord.fulfillment_type || 'Home Delivery'}</strong> | Address: ${ord.delivery_address || 'Self Pickup'}</div>
            <div style="font-size:0.82rem; color:var(--text-secondary); margin-bottom:0.5rem;">Slot: ${ord.time_slot || 'ASAP'} | Payment: ${ord.payment_method || 'COD'}</div>
            <div style="margin-top:0.5rem; padding-top:0.5rem; border-top:1px solid var(--border-hover);">
              <div style="font-size:0.8rem; font-weight:700; color:var(--text-secondary); margin-bottom:0.3rem;">Order Items:</div>
              ${itemsHtml}
              <div style="display:flex; justify-content:space-between; align-items:center; margin-top:0.6rem; font-weight:bold; font-size:0.95rem; color:var(--text-primary);">
                <span>Total Amount:</span>
                <span style="color:var(--primary-color);">₹${ord.grand_total}</span>
              </div>
            </div>
          </div>
        `;
      }).join('');
    } else {
      container.innerHTML = `<div style="padding:2.5rem 1rem; text-align:center; color:var(--text-secondary);">No orders recorded in Supabase PostgreSQL yet. Placed customer orders will appear here live across all devices!</div>`;
    }
  }
};

window.closeAdminOrdersModal = function() {
  const modal = document.getElementById('adminOrdersModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
};


