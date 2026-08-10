/* ==========================================================================
   SHREE HANUMAN SUPER MARKET - Live Product Search & Category Showcase Engine
   Includes 2-second Auto-rotating Hero Hot Deals Showcase and Arrow Navigation
   Owner: Jitendra Bhanwarlal Unecha | Contact: 7083568189
   ========================================================================== */

let activeCategory = 'all';
let searchQuery = '';
let heroSlideIndex = 0;
let heroSlideTimer = null;

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('productSearchInput');
  const filterButtons = document.querySelectorAll('.filter-btn');

  // Initial Renders
  initHeroHotDealsRotator();
  renderCategoryShowcases();
  renderProducts();

  // Search Input Listener
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderProducts();
    });
  }

  // Category Filter Buttons Listener
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      activeCategory = button.getAttribute('data-category');
      renderProducts();
    });
  });
});

/* --------------------------------------------------------------------------
   1. HERO SECTION HOT DEALS AUTO-ROTATOR (2 SECONDS)
   -------------------------------------------------------------------------- */
function initHeroHotDealsRotator() {
  const heroContainer = document.getElementById('heroProductsGrid');
  if (!heroContainer) return;

  const hotDeals = productsData.filter(p => p.featuredHero || p.badge === 'Hot Deal' || p.badge === 'Sulphur Free' || p.badge === 'Farm Fresh' || p.badge === 'Best Seller');
  if (hotDeals.length === 0) return;

  const renderHeroSlide = (index) => {
    const product = hotDeals[index % hotDeals.length];

    heroContainer.innerHTML = `
      <div class="hero-slideshow-card animate-fade-in">
        <div class="hero-slideshow-badge">${product.badge || 'Hot Deal'} • Changes in 2s</div>
        <div class="hero-slideshow-img-box">
          <img src="${product.image}" alt="${product.name}" class="hero-slideshow-img">
        </div>
        <div class="hero-slideshow-info">
          <span class="hero-card-brand">${product.brand}</span>
          <h4 class="hero-slideshow-title">${product.name}</h4>
          <div class="hero-slideshow-weight">${product.weight}</div>
          <div class="hero-slideshow-price-row">
            <div class="hero-slideshow-price">₹${product.price.toLocaleString('en-IN')} <span>/ ${product.unit}</span></div>
            <button type="button" class="btn btn-cart-sm btn-ripple" onclick="addToCart('${product.id}', 1)">
              <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/></svg>
              Add to Cart
            </button>
          </div>
        </div>

        <!-- Slideshow Indicators -->
        <div class="hero-slideshow-dots">
          ${hotDeals.map((_, i) => `<span class="dot-sm ${i === (index % hotDeals.length) ? 'active' : ''}" onclick="setHeroSlide(${i})"></span>`).join('')}
        </div>
      </div>
    `;
  };

  // Initial Slide
  renderHeroSlide(heroSlideIndex);

  // Auto transition every 2000ms (2 seconds)
  if (heroSlideTimer) clearInterval(heroSlideTimer);
  heroSlideTimer = setInterval(() => {
    heroSlideIndex = (heroSlideIndex + 1) % hotDeals.length;
    renderHeroSlide(heroSlideIndex);
  }, 2000);
}

function setHeroSlide(idx) {
  heroSlideIndex = idx;
  const hotDeals = productsData.filter(p => p.featuredHero || p.badge === 'Hot Deal' || p.badge === 'Sulphur Free' || p.badge === 'Farm Fresh' || p.badge === 'Best Seller');
  if (hotDeals.length > 0) {
    const heroContainer = document.getElementById('heroProductsGrid');
    if (heroContainer) {
      const product = hotDeals[idx % hotDeals.length];
      heroContainer.innerHTML = `
        <div class="hero-slideshow-card animate-fade-in">
          <div class="hero-slideshow-badge">${product.badge || 'Hot Deal'} • Changes in 2s</div>
          <div class="hero-slideshow-img-box">
            <img src="${product.image}" alt="${product.name}" class="hero-slideshow-img">
          </div>
          <div class="hero-slideshow-info">
            <span class="hero-card-brand">${product.brand}</span>
            <h4 class="hero-slideshow-title">${product.name}</h4>
            <div class="hero-slideshow-weight">${product.weight}</div>
            <div class="hero-slideshow-price-row">
              <div class="hero-slideshow-price">₹${product.price.toLocaleString('en-IN')} <span>/ ${product.unit}</span></div>
              <button type="button" class="btn btn-cart-sm btn-ripple" onclick="addToCart('${product.id}', 1)">
                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/></svg>
                Add to Cart
              </button>
            </div>
          </div>
          <div class="hero-slideshow-dots">
            ${hotDeals.map((_, i) => `<span class="dot-sm ${i === idx ? 'active' : ''}" onclick="setHeroSlide(${i})"></span>`).join('')}
          </div>
        </div>
      `;
    }
  }
}

/* --------------------------------------------------------------------------
   2. CATEGORY SHOWCASE TRACKS & ARROW SCROLLING
   -------------------------------------------------------------------------- */
function renderCategoryShowcases() {
  // 1. Sugar, Tea, Wheat & Rice Showcase
  const sugarTeaGrid = document.getElementById('sugarTeaGrid') || document.getElementById('sugarTeaTrack');
  if (sugarTeaGrid) {
    const items = productsData.filter(p => p.category === 'sugar_tea');
    sugarTeaGrid.innerHTML = renderCardMarkupList(items, true);
  }

  // 2. Fresh Vegetables Showcase
  const vegGrid = document.getElementById('vegetablesGrid') || document.getElementById('vegetablesTrack');
  if (vegGrid) {
    const items = productsData.filter(p => p.category === 'vegetables');
    vegGrid.innerHTML = renderCardMarkupList(items, true);
  }

  // 3. Wafers, Biscuits & Snacks Showcase
  const snackGrid = document.getElementById('wafersSnacksGrid') || document.getElementById('wafersSnacksTrack');
  if (snackGrid) {
    const items = productsData.filter(p => p.category === 'wafers_snacks');
    snackGrid.innerHTML = renderCardMarkupList(items, true);
  }
}

// Global Left / Right Scroll Helper for Showcase Sections
window.scrollShowcase = function(containerId, amount) {
  const container = document.getElementById(containerId);
  if (container) {
    container.scrollBy({ left: amount, behavior: 'smooth' });
  }
};

function scrollTrackLeft(trackId) {
  scrollShowcase(trackId, -280);
}

function scrollTrackRight(trackId) {
  scrollShowcase(trackId, 280);
}

// Generate Compact Product Card HTML
function renderCardMarkupList(itemList, isCompact = false) {
  return itemList.map(product => {
    // Professional Clean WhatsApp Message (No decorative asterisks clutter)
    const cleanMsg = `GROCERY ENQUIRY - SHREE HANUMAN SUPER MARKET\n\nProduct: ${product.name}\nBrand: ${product.brand}\nPack: ${product.weight}\nPrice: Rs.${product.price} / ${product.unit}\n\nPlease confirm stock availability.`;
    const whatsappUrl = `https://wa.me/917083568189?text=${encodeURIComponent(cleanMsg)}`;

    return `
      <div class="product-card ${isCompact ? 'product-card-compact' : ''}">
        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
        <div class="product-img-box">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
        </div>
        <div class="product-details">
          <span class="product-brand">${product.brand}</span>
          <h3 class="product-name">${product.name}</h3>
          <p class="product-weight">${product.weight}</p>
          
          <div class="product-price-row">
            <div class="price-box">
              <span class="price-label">Price</span>
              <div class="product-price">₹${product.price.toLocaleString('en-IN')} <span style="font-size:0.8rem; font-weight:normal; color:var(--text-secondary);">/ ${product.unit}</span></div>
            </div>
            <span class="stock-status-tag">${product.availability}</span>
          </div>

          <div class="card-cart-controls">
            <div class="card-qty-wrapper">
              <button type="button" class="card-qty-btn" onclick="decreaseCardQty('${product.id}')">-</button>
              <input type="number" id="cardQty_${product.id}" value="1" min="1" max="99" class="card-qty-input">
              <button type="button" class="card-qty-btn" onclick="increaseCardQty('${product.id}')">+</button>
            </div>

            <button type="button" class="btn btn-cart btn-ripple" onclick="triggerAddToCart('${product.id}')">
              <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/>
              </svg>
              Add
            </button>
          </div>

          <div class="product-actions-sub">
            <a href="${whatsappUrl}" target="_blank" class="btn-sub-link">
              <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-0.999 3.648 3.742-0.981z"/></svg>
              WhatsApp Enquiry
            </a>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Render Main Catalog Grid
function renderProducts() {
  const container = document.getElementById('productsGrid');
  if (!container) return;

  const filtered = productsData.filter(product => {
    const matchesCategory = (activeCategory === 'all') || (product.category === activeCategory);
    const matchesSearch = product.name.toLowerCase().includes(searchQuery) ||
                           product.brand.toLowerCase().includes(searchQuery) ||
                           product.categoryLabel.toLowerCase().includes(searchQuery) ||
                           product.weight.toLowerCase().includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="no-products">
        <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="margin-bottom:1rem; opacity:0.5;">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <h4 style="font-size:1.2rem; font-family:var(--font-heading); margin-bottom:0.5rem;">No Products Found</h4>
        <p style="font-size:0.9rem; color:var(--text-secondary);">Try adjusting your search query or category filter.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = renderCardMarkupList(filtered, true);
}

// Helpers for product card quantity adjustment
function decreaseCardQty(id) {
  const input = document.getElementById(`cardQty_${id}`);
  if (input) {
    let val = parseInt(input.value, 10) || 1;
    if (val > 1) input.value = val - 1;
  }
}

function increaseCardQty(id) {
  const input = document.getElementById(`cardQty_${id}`);
  if (input) {
    let val = parseInt(input.value, 10) || 1;
    input.value = val + 1;
  }
}

function triggerAddToCart(id) {
  const input = document.getElementById(`cardQty_${id}`);
  const qty = input ? (parseInt(input.value, 10) || 1) : 1;
  addToCart(id, qty);
}

/* --------------------------------------------------------------------------
   3. OWNER PIN SECURITY & ADD NEW PRODUCT MODAL SYSTEM
   -------------------------------------------------------------------------- */
let isOwnerVerified = false;
let pendingTargetCategory = 'all';

// Trigger PIN check or open Add Product modal directly if verified
window.triggerPinCheck = function(category = 'all') {
  pendingTargetCategory = category;

  if (isOwnerVerified) {
    openAddProductModalDirectly();
  } else {
    const pinModal = document.getElementById('pinVerifyModal');
    const errSpan = document.getElementById('pinErrorMsg');
    const pinInput = document.getElementById('ownerPinInput');
    if (errSpan) errSpan.style.display = 'none';
    if (pinInput) pinInput.value = '';
    if (pinModal) {
      pinModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      setTimeout(() => pinInput?.focus(), 100);
    }
  }
};

window.closePinModal = function() {
  const pinModal = document.getElementById('pinVerifyModal');
  if (pinModal) {
    pinModal.classList.remove('active');
    document.body.style.overflow = '';
  }
};

window.openAddProductModalDirectly = function() {
  const addModal = document.getElementById('addProductModal');
  const catSelect = document.getElementById('newProdCategory');

  if (catSelect && pendingTargetCategory !== 'all') {
    catSelect.value = pendingTargetCategory;
  }

  if (addModal) {
    addModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
};

window.closeAddProductModal = function() {
  const addModal = document.getElementById('addProductModal');
  if (addModal) {
    addModal.classList.remove('active');
    document.body.style.overflow = '';
  }
};

// Bind Modal Form Submissions
document.addEventListener('DOMContentLoaded', () => {
  // PIN Form Submission
  const pinForm = document.getElementById('pinVerifyForm');
  pinForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const pinVal = document.getElementById('ownerPinInput')?.value.trim();
    const errSpan = document.getElementById('pinErrorMsg');

    // Valid PINs: 7083, 1234, 7083568189
    if (pinVal === '7083' || pinVal === '1234' || pinVal === '7083568189') {
      isOwnerVerified = true;
      if (errSpan) errSpan.style.display = 'none';
      closePinModal();
      openAddProductModalDirectly();
    } else {
      if (errSpan) {
        errSpan.style.display = 'block';
      } else {
        alert('Incorrect PIN! Access denied.');
      }
    }
  });

  // Add New Product Form Submission
  const addProdForm = document.getElementById('addNewProductForm');
  addProdForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const category = document.getElementById('newProdCategory').value;
    const name = document.getElementById('newProdName').value.trim();
    const brand = document.getElementById('newProdBrand').value.trim();
    const weight = document.getElementById('newProdWeight').value.trim();
    const price = parseFloat(document.getElementById('newProdPrice').value) || 0;
    const unit = document.getElementById('newProdUnit').value;
    const badge = document.getElementById('newProdBadge').value || 'New Launch';
    let image = document.getElementById('newProdImage')?.value.trim();

    if (!name || !brand || !weight || price <= 0) {
      alert('Please fill out all required product fields correctly.');
      return;
    }

    // Default image fallback if left empty
    if (!image) {
      if (category === 'vegetables') image = 'images/fresh_vegetables.png';
      else if (category === 'wafers_snacks') image = 'images/potato_chips.png';
      else if (category === 'oil') image = 'images/sunflower_oil.png';
      else if (category === 'spices') image = 'images/spices_combo.png';
      else if (category === 'sugar_tea') image = 'images/wheat_atta.png';
      else image = 'images/logo.jpg';
    }

    const categoryLabels = {
      sugar_tea: 'Sugar, Tea, Wheat & Rice',
      vegetables: 'Fresh Vegetables & Fruits',
      wafers_snacks: 'Wafers, Biscuits & Snacks',
      oil: 'Cooking Oil & Ghee',
      pulses: 'Pulses & Dal',
      spices: 'Spices & Masala',
      dryfruits: 'Dry Fruits & Nuts',
      cleaning: 'Cleaning & Household',
      personal: 'Personal Care'
    };

    const newProdObj = {
      id: 'prod-custom-' + Date.now(),
      name: name,
      brand: brand,
      category: category,
      categoryLabel: categoryLabels[category] || 'Daily Essentials',
      weight: weight,
      price: price,
      unit: unit,
      availability: 'In Stock',
      badge: badge,
      featuredHero: badge === 'Hot Deal',
      image: image,
      description: `${name} by ${brand} (${weight}). Available at Shree Hanuman Super Market Warje Pune.`
    };

    // Save product to dataset & localStorage
    if (typeof addNewProductToDataset === 'function') {
      addNewProductToDataset(newProdObj);
    } else {
      productsData.unshift(newProdObj);
    }

    // Re-render UI views
    renderCategoryShowcases();
    renderProducts();

    closeAddProductModal();
    addProdForm.reset();

    if (typeof showToastNotification === 'function') {
      showToastNotification(`Successfully published "${name}" to store catalog!`);
    } else {
      alert(`Product "${name}" added successfully!`);
    }
  });
});
