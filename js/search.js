/* ==========================================================================
   SHREE HANUMAN SUPER MARKET - Live Product Search & Category Showcase Engine
   Includes 2-second Auto-rotating Hero Hot Deals Showcase and Arrow Navigation
   Owner: Jitendra Bhanwarlal Unecha | Contact: 7083568189
   ========================================================================== */

let activeCategory = 'all';
let searchQuery = '';
let heroSlideIndex = 0;
let heroSlideTimer = null;
let customCategories = [];

function loadStoredCustomCategories() {
  try {
    const stored = localStorage.getItem('shree_hanuman_custom_categories_v1');
    if (stored) {
      customCategories = JSON.parse(stored);
    }
  } catch (e) {
    console.warn('Could not load custom categories', e);
  }
}

function saveCustomCategories() {
  try {
    localStorage.setItem('shree_hanuman_custom_categories_v1', JSON.stringify(customCategories));
  } catch (e) {
    console.warn('Could not save custom categories', e);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadStoredCustomCategories();

  const searchInput = document.getElementById('productSearchInput');

  // Initial Renders
  initHeroHotDealsRotator();
  updateCategoryDropdownsAndFilters();
  renderCategoryShowcases();
  renderProducts();

  // Option 2 Cloud Sync: Fetch live products, sections & overrides from Cloud DB across all devices
  if (window.CloudDB && typeof window.CloudDB.initCloudSync === 'function') {
    window.CloudDB.initCloudSync((changed) => {
      if (changed) {
        updateCategoryDropdownsAndFilters();
        renderCategoryShowcases();
        renderProducts();
      }
    });
  }

  // Search Input Listener
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderProducts();
    });
  }
  // Global header search sync helper
  window.syncHeaderSearch = function(val) {
    const catalogInput = document.getElementById('productSearchInput');
    searchQuery = val.toLowerCase().trim();
    if (catalogInput) catalogInput.value = val;
    renderProducts();
  };
});

/* --------------------------------------------------------------------------
   1. HERO SECTION HOT DEALS AUTO-ROTATOR (3 SECONDS)
   -------------------------------------------------------------------------- */
function initHeroHotDealsRotator() {
  const heroContainer = document.getElementById('heroProductsGrid');
  if (!heroContainer) return;

  const hotDeals = productsData.filter(p => p.featuredHero || p.badge === 'Hot Deal' || p.badge === 'Sulphur Free' || p.badge === 'Farm Fresh' || p.badge === 'Best Seller');
  if (hotDeals.length === 0) return;

  const renderHeroSlide = (index) => {
    const product = hotDeals[index % hotDeals.length];

    heroContainer.innerHTML = `
      <div class="hero-promo-header">
        <span>Today's Featured Deal</span>
        <span class="hero-promo-badge">${product.badge || 'Hot Deal'}</span>
      </div>
      <div class="hero-slideshow-card">
        <div class="hero-slideshow-img-box">
          <img src="${product.image}" alt="${product.name}" class="hero-slideshow-img">
        </div>
        <div class="hero-slideshow-info">
          <span class="product-brand">${product.brand}</span>
          <h4 class="hero-slideshow-title">${product.name}</h4>
          <div class="hero-slideshow-weight">${product.weight}</div>
          <div class="hero-slideshow-price-row">
            <div class="hero-slideshow-price">₹${product.price.toLocaleString('en-IN')} <span style="font-size:0.8rem; font-weight:500; color:var(--text-secondary);">/ ${product.unit}</span></div>
            <button type="button" class="btn btn-primary btn-sm" onclick="addToCart('${product.id}', 1)">
              + Add to Cart
            </button>
          </div>
        </div>
      </div>
      <div class="hero-owner-mini-card">
        <img src="images/logo.jpg" alt="Shree Hanuman Super Market" class="hero-mini-logo">
        <div>
          <div class="badge-text-title">Jitendra Bhanwarlal Unecha</div>
          <div class="badge-text-sub">Owner & Manager | Call: 7083568189</div>
        </div>
      </div>
    `;
  };

  renderHeroSlide(heroSlideIndex);

  if (heroSlideTimer) clearInterval(heroSlideTimer);
  heroSlideTimer = setInterval(() => {
    heroSlideIndex = (heroSlideIndex + 1) % hotDeals.length;
    renderHeroSlide(heroSlideIndex);
  }, 3000);
}

function setHeroSlide(idx) {
  heroSlideIndex = idx;
  const hotDeals = productsData.filter(p => p.featuredHero || p.badge === 'Hot Deal' || p.badge === 'Sulphur Free' || p.badge === 'Farm Fresh' || p.badge === 'Best Seller');
  if (hotDeals.length > 0) {
    const heroContainer = document.getElementById('heroProductsGrid');
    if (heroContainer) {
      const product = hotDeals[idx % hotDeals.length];
      heroContainer.innerHTML = `
        <div class="hero-promo-header">
          <span>Today's Featured Deal</span>
          <span class="hero-promo-badge">${product.badge || 'Hot Deal'}</span>
        </div>
        <div class="hero-slideshow-card">
          <div class="hero-slideshow-img-box">
            <img src="${product.image}" alt="${product.name}" class="hero-slideshow-img">
          </div>
          <div class="hero-slideshow-info">
            <span class="product-brand">${product.brand}</span>
            <h4 class="hero-slideshow-title">${product.name}</h4>
            <div class="hero-slideshow-weight">${product.weight}</div>
            <div class="hero-slideshow-price-row">
              <div class="hero-slideshow-price">₹${product.price.toLocaleString('en-IN')} <span style="font-size:0.8rem; font-weight:500; color:var(--text-secondary);">/ ${product.unit}</span></div>
              <button type="button" class="btn btn-primary btn-sm" onclick="addToCart('${product.id}', 1)">
                + Add to Cart
              </button>
            </div>
          </div>
        </div>
        <div class="hero-owner-mini-card">
          <img src="images/logo.jpg" alt="Shree Hanuman Super Market" class="hero-mini-logo">
          <div>
            <div class="badge-text-title">Jitendra Bhanwarlal Unecha</div>
            <div class="badge-text-sub">Owner & Manager | Call: 7083568189</div>
          </div>
        </div>
      `;
    }
  }
}

/* --------------------------------------------------------------------------
   2. CATEGORY SHOWCASE TRACKS & AUTO LEFT-TO-RIGHT SCROLLING
   -------------------------------------------------------------------------- */
function renderCategoryShowcases() {
  const categoryGrids = [
    { id: 'sugarTeaGrid', cat: 'sugar_tea' },
    { id: 'vegetablesGrid', cat: 'vegetables' },
    { id: 'wafersSnacksGrid', cat: 'wafers_snacks' },
    { id: 'oilGrid', cat: 'oil' },
    { id: 'pulsesGrid', cat: 'pulses' },
    { id: 'spicesGrid', cat: 'spices' },
    { id: 'dryfruitsGrid', cat: 'dryfruits' },
    { id: 'cleaningGrid', cat: 'cleaning' },
    { id: 'bestValueGrid', cat: 'best_value' }
  ];

  categoryGrids.forEach(g => {
    const container = document.getElementById(g.id);
    if (container) {
      const items = productsData.filter(p => p.category === g.cat || (g.cat === 'cleaning' && (p.category === 'cleaning' || p.category === 'personal')));
      if (items.length > 0) {
        container.innerHTML = renderCardMarkupList(items, true);
      }
    }
  });

  // Render Custom Admin Created Showcase Sections
  const customContainer = document.getElementById('customCategoryShowcases');
  if (customContainer) {
    let customHtml = '';
    customCategories.forEach((c, idx) => {
      const items = productsData.filter(p => p.category === c.key);
      const sectionId = c.key.replace(/_/g, '-') + '-section';
      const gridId = c.key.replace(/_/g, '') + 'Grid';
      const bgStyle = (idx % 2 === 0) ? 'background: var(--bg-soft-section);' : '';

      customHtml += `
        <section class="section category-showcase-section reveal revealed" id="${sectionId}" style="${bgStyle}">
          <div class="container">
            <div class="showcase-header-row">
              <div class="section-header text-left-md">
                <div class="badge">${c.badge || 'Store Section'}</div>
                <h2 class="section-title">${c.icon || '🏷️'} <span>${c.label}</span></h2>
                <p class="section-description">${c.description || ''}</p>
              </div>
              <div class="showcase-arrows" style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
                ${isOwnerVerified ? `
                  <button type="button" class="section-admin-quick-add" onclick="triggerPinCheck('${c.key}')" title="Add Product to ${c.label}">
                    ➕ Add Product to Section
                  </button>
                  <button type="button" class="btn-admin-logout" style="padding:0.25rem 0.6rem; font-size:0.75rem;" onclick="deleteCustomSection('${c.key}')" title="Delete Section">
                    🗑️ Delete Section
                  </button>
                ` : ''}
                <button type="button" class="showcase-arrow-btn" onclick="scrollShowcase('${gridId}', -280)" aria-label="Previous">&larr;</button>
                <button type="button" class="showcase-arrow-btn" onclick="scrollShowcase('${gridId}', 280)" aria-label="Next">&rarr;</button>
              </div>
            </div>

            <div class="showcase-slider-container">
              <div class="products-grid showcase-grid-scroll" id="${gridId}">
                ${items.length > 0 ? renderCardMarkupList(items, true) : `
                  <div style="padding:2.5rem 1rem; text-align:center; color:var(--text-secondary); width:100%; border:2px dashed var(--border-color); border-radius:12px;">
                    <p style="font-weight:600; margin-bottom:0.5rem;">No products added to "${c.label}" yet.</p>
                    ${isOwnerVerified ? `
                      <button type="button" class="btn btn-primary btn-sm" onclick="triggerPinCheck('${c.key}')">
                        ➕ Add First Product to ${c.label}
                      </button>
                    ` : '<p style="font-size:0.85rem;">Admin can enter PIN 123!@# to add items here.</p>'}
                  </div>
                `}
              </div>
            </div>
          </div>
        </section>
      `;
    });
    customContainer.innerHTML = customHtml;
  }

  initShowcaseAutoScroll();
}

// Auto Left-To-Right Continuous Horizontal Scroll Loop for Showcase Sections (Disabled to stop auto-scroll)
let showcaseScrollIntervals = [];

function initShowcaseAutoScroll() {
  // Clear any existing intervals and stop continuous auto-scrolling
  showcaseScrollIntervals.forEach(inv => clearInterval(inv));
  showcaseScrollIntervals = [];
}

// Global Left / Right Manual Scroll Helper for Showcase Sections
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

// Generate Product Card HTML (Includes Admin Edit Button when verified)
function renderCardMarkupList(itemList, isCompact = false) {
  return itemList.map(product => {
    // Professional Clean WhatsApp Message (No decorative asterisks clutter)
    const cleanMsg = `GROCERY ENQUIRY - SHREE HANUMAN SUPER MARKET\n\nProduct: ${product.name}\nBrand: ${product.brand}\nPack: ${product.weight}\nPrice: Rs.${product.price} / ${product.unit}\n\nPlease confirm stock availability.`;
    const whatsappUrl = `https://wa.me/917083568189?text=${encodeURIComponent(cleanMsg)}`;

    return `
      <div class="product-card ${isCompact ? 'product-card-compact' : ''}" data-id="${product.id}">
        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
        
        ${isOwnerVerified ? `
          <button type="button" class="admin-edit-btn" onclick="triggerEditProduct('${product.id}')" title="Edit this product">
            ✏️ Edit
          </button>
        ` : ''}

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
            <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="btn-sub-link">
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
    const matchesCategory = (activeCategory === 'all') || (product.category === activeCategory) || (activeCategory === 'cleaning' && (product.category === 'cleaning' || product.category === 'personal'));
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
   3. SECRET OWNER PIN SECURITY & ADMIN EDIT/ADD PRODUCT SYSTEM
   -------------------------------------------------------------------------- */
let isOwnerVerified = false;
let pendingTargetCategory = 'all';

// Secret PIN strictly set to 123!@#
const SECRET_OWNER_PIN = '123!@#';

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

window.showAdminBar = function() {
  const adminBar = document.getElementById('adminActionBar');
  if (adminBar) {
    adminBar.style.display = 'flex';
  }
};

window.lockAdminSession = function() {
  isOwnerVerified = false;
  const adminBar = document.getElementById('adminActionBar');
  if (adminBar) {
    adminBar.style.display = 'none';
  }
  renderCategoryShowcases();
  renderProducts();
  if (typeof showToastNotification === 'function') {
    showToastNotification('Admin mode locked.');
  }
};

window.openAddSectionModal = function() {
  if (!isOwnerVerified) {
    triggerPinCheck('all');
    return;
  }
  const modal = document.getElementById('addSectionModal');
  const input = document.getElementById('newSectionTitle');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => input?.focus(), 100);
  }
};

window.closeAddSectionModal = function() {
  const modal = document.getElementById('addSectionModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
};

window.deleteCustomSection = function(key) {
  if (!isOwnerVerified) return;
  const sec = customCategories.find(c => c.key === key);
  if (!sec) return;

  if (confirm(`Are you sure you want to delete the section "${sec.label}"?`)) {
    customCategories = customCategories.filter(c => c.key !== key);
    saveCustomCategories();
    if (window.CloudDB && typeof window.CloudDB.deleteCategory === 'function') {
      window.CloudDB.deleteCategory(key);
    }
    updateCategoryDropdownsAndFilters();
    renderCategoryShowcases();
    renderProducts();
    if (typeof showToastNotification === 'function') {
      showToastNotification(`Section "${sec.label}" deleted.`);
    }
  }
};

function updateCategoryDropdownsAndFilters() {
  const newCatSelect = document.getElementById('newProdCategory');
  const editCatSelect = document.getElementById('editProdCategory');
  const headerCatSelect = document.getElementById('headerCategorySelect');

  const baseOptions = [
    { value: 'sugar_tea', label: 'Sugar, Tea, Wheat & Rice' },
    { value: 'vegetables', label: 'Fresh Vegetables & Fruits' },
    { value: 'wafers_snacks', label: 'Wafers, Biscuits & Snacks' },
    { value: 'oil', label: 'Cooking Oil & Ghee' },
    { value: 'pulses', label: 'Pulses & Dal' },
    { value: 'spices', label: 'Spices & Masala' },
    { value: 'dryfruits', label: 'Dry Fruits & Nuts' },
    { value: 'cleaning', label: 'Cleaning & Personal Care' },
    { value: 'best_value', label: 'Best Value Mega Deals' }
  ];

  const allCategories = [
    ...baseOptions,
    ...customCategories.map(c => ({ value: c.key, label: `${c.icon || '🏷️'} ${c.label}` }))
  ];

  if (newCatSelect) {
    const currVal = newCatSelect.value;
    newCatSelect.innerHTML = allCategories.map(c => `<option value="${c.value}">${c.label}</option>`).join('');
    if (currVal && allCategories.some(c => c.value === currVal)) newCatSelect.value = currVal;
  }

  if (editCatSelect) {
    const currVal = editCatSelect.value;
    editCatSelect.innerHTML = allCategories.map(c => `<option value="${c.value}">${c.label}</option>`).join('');
    if (currVal && allCategories.some(c => c.value === currVal)) editCatSelect.value = currVal;
  }

  if (headerCatSelect) {
    const currVal = headerCatSelect.value;
    headerCatSelect.innerHTML = `
      <option value="all">🔍 Filter Category...</option>
      <option value="all">All Items</option>
      ${allCategories.map(c => `<option value="${c.value}">${c.label}</option>`).join('')}
    `;
    if (currVal && (currVal === 'all' || allCategories.some(c => c.value === currVal))) {
      headerCatSelect.value = currVal;
    }
  }

  // Update Catalog Category Buttons (#filterCategories)
  const filterCategoriesContainer = document.getElementById('filterCategories');
  if (filterCategoriesContainer) {
    let filterHtml = `
      <button class="filter-btn ${activeCategory === 'all' ? 'active' : ''}" data-category="all">All Items</button>
      <button class="filter-btn ${activeCategory === 'sugar_tea' ? 'active' : ''}" data-category="sugar_tea">Sugar, Tea, Wheat & Rice</button>
      <button class="filter-btn ${activeCategory === 'vegetables' ? 'active' : ''}" data-category="vegetables">Fresh Vegetables</button>
      <button class="filter-btn ${activeCategory === 'wafers_snacks' ? 'active' : ''}" data-category="wafers_snacks">Wafers & Snacks</button>
      <button class="filter-btn ${activeCategory === 'oil' ? 'active' : ''}" data-category="oil">Cooking Oil & Ghee</button>
      <button class="filter-btn ${activeCategory === 'pulses' ? 'active' : ''}" data-category="pulses">Pulses & Dal</button>
      <button class="filter-btn ${activeCategory === 'spices' ? 'active' : ''}" data-category="spices">Spices & Masala</button>
      <button class="filter-btn ${activeCategory === 'dryfruits' ? 'active' : ''}" data-category="dryfruits">Dry Fruits</button>
      <button class="filter-btn ${activeCategory === 'cleaning' ? 'active' : ''}" data-category="cleaning">Cleaning & Personal</button>
    `;

    customCategories.forEach(c => {
      filterHtml += `<button class="filter-btn ${activeCategory === c.key ? 'active' : ''}" data-category="${c.key}">${c.icon || '🏷️'} ${c.label}</button>`;
    });

    filterCategoriesContainer.innerHTML = filterHtml;

    // Rebind filter button listeners
    const buttons = filterCategoriesContainer.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = btn.getAttribute('data-category');
        renderProducts();
      });
    });
  }
}

window.closeAddProductModal = function() {
  const addModal = document.getElementById('addProductModal');
  if (addModal) {
    addModal.classList.remove('active');
    document.body.style.overflow = '';
  }
};

let newUploadedImageBase64 = '';
let editUploadedImageBase64 = '';

// Edit Product Modal Trigger & Helper
window.triggerEditProduct = function(productId) {
  const product = productsData.find(p => p.id === productId);
  if (!product) return;

  newUploadedImageBase64 = '';
  editUploadedImageBase64 = '';

  document.getElementById('editProdId').value = product.id;
  document.getElementById('editProdName').value = product.name;
  document.getElementById('editProdBrand').value = product.brand;
  document.getElementById('editProdCategory').value = product.category;
  document.getElementById('editProdWeight').value = product.weight;
  document.getElementById('editProdPrice').value = product.price;
  document.getElementById('editProdUnit').value = product.unit;
  document.getElementById('editProdBadge').value = product.badge || 'New Launch';
  document.getElementById('editProdImage').value = product.image;

  const fileInput = document.getElementById('editProdImageFile');
  if (fileInput) fileInput.value = '';

  const imgPreview = document.getElementById('editProdImagePreview');
  const statusSpan = document.getElementById('editProdImagePreviewStatus');
  if (imgPreview) imgPreview.src = product.image;
  if (statusSpan) {
    statusSpan.textContent = 'Current product image';
    statusSpan.style.color = 'var(--text-secondary)';
    statusSpan.style.fontWeight = 'normal';
  }

  const editModal = document.getElementById('editProductModal');
  if (editModal) {
    editModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
};

window.closeEditProductModal = function() {
  const editModal = document.getElementById('editProductModal');
  if (editModal) {
    editModal.classList.remove('active');
    document.body.style.overflow = '';
  }
};

// Global Top Header Category Selector Trigger
window.filterCategoryFromHeader = function(category) {
  activeCategory = category;

  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-category') === category);
  });

  renderProducts();

  const targetElem = (category !== 'all' && category !== 'best_value') 
    ? (document.getElementById(category.replace('_', '-') + '-section') || document.getElementById('products')) 
    : document.getElementById('products');

  if (targetElem) {
    targetElem.scrollIntoView({ behavior: 'smooth' });
  }
};

// HTML5 Canvas High-Res Image Compression (Prevents high-res upload slowdown)
function compressImageFile(file, callback) {
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      const maxDim = 600;

      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      const compressedBase64 = canvas.toDataURL('image/jpeg', 0.82);
      callback(compressedBase64);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// Bind Modal Form Submissions & File Upload Listeners
document.addEventListener('DOMContentLoaded', () => {
  // Sync Cloud DB for all visitors worldwide on load
  if (typeof CloudDB !== 'undefined' && CloudDB.initCloudSync) {
    CloudDB.initCloudSync(() => {
      updateCategoryDropdownsAndFilters();
      renderCategoryShowcases();
      renderProducts();
    });
  }

  // High-Res Auto-Compressed File upload listener for New Product
  const newFileInput = document.getElementById('newProdImageFile');
  newFileInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      compressImageFile(file, function(compressedDataUrl) {
        newUploadedImageBase64 = compressedDataUrl;
        const preview = document.getElementById('newProdImagePreview');
        const previewBox = document.getElementById('newProdImagePreviewBox');
        if (preview) preview.src = compressedDataUrl;
        if (previewBox) previewBox.style.display = 'flex';
      });
    }
  });

  // High-Res Auto-Compressed File upload listener for Edit Product
  const editFileInput = document.getElementById('editProdImageFile');
  editFileInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      compressImageFile(file, function(compressedDataUrl) {
        editUploadedImageBase64 = compressedDataUrl;
        const preview = document.getElementById('editProdImagePreview');
        const statusSpan = document.getElementById('editProdImagePreviewStatus');
        if (preview) preview.src = compressedDataUrl;
        if (statusSpan) {
          statusSpan.textContent = '✓ High-res image compressed & attached';
          statusSpan.style.color = 'var(--success)';
          statusSpan.style.fontWeight = '600';
        }
      });
    }
  });

  // PIN Form Submission
  const pinForm = document.getElementById('pinVerifyForm');
  pinForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const pinVal = document.getElementById('ownerPinInput')?.value.trim();
    const errSpan = document.getElementById('pinErrorMsg');

    // Strict Secret PIN verification: 123!@#
    if (pinVal === SECRET_OWNER_PIN || pinVal === '123!@#') {
      isOwnerVerified = true;
      if (errSpan) errSpan.style.display = 'none';
      closePinModal();
      showAdminBar();
      openAddProductModalDirectly();

      // Re-render UI to show Admin Edit buttons on cards
      updateCategoryDropdownsAndFilters();
      renderCategoryShowcases();
      renderProducts();
    } else {
      if (errSpan) {
        errSpan.style.display = 'block';
      } else {
        alert('Incorrect PIN! Access denied.');
      }
    }
  });

  // Add New Section Form Submission
  const addSectionForm = document.getElementById('addNewSectionForm');
  addSectionForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('newSectionTitle').value.trim();
    const icon = document.getElementById('newSectionIcon').value;
    const badge = document.getElementById('newSectionBadge').value.trim() || 'New Section';
    const desc = document.getElementById('newSectionDesc').value.trim();

    if (!title) {
      alert('Please enter a section name.');
      return;
    }

    const categoryKey = 'custom_cat_' + title.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Date.now().toString().slice(-4);
    const newCat = {
      key: categoryKey,
      label: title,
      icon: icon,
      badge: badge,
      description: desc || `Fresh ${title} items available at Shree Hanuman Super Market Warje.`
    };

    customCategories.push(newCat);
    saveCustomCategories();
    if (window.CloudDB && typeof window.CloudDB.saveCategory === 'function') {
      window.CloudDB.saveCategory(newCat);
    }

    updateCategoryDropdownsAndFilters();
    renderCategoryShowcases();
    renderProducts();

    closeAddSectionModal();
    addSectionForm.reset();

    if (typeof showToastNotification === 'function') {
      showToastNotification(`Section "${title}" created successfully!`);
    } else {
      alert(`Section "${title}" created successfully!`);
    }

    // Automatically pre-select new category in Add Product Modal & open it
    pendingTargetCategory = categoryKey;
    openAddProductModalDirectly();
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
    let image = newUploadedImageBase64 || document.getElementById('newProdImage')?.value.trim();

    if (!name || !brand || !weight || price <= 0) {
      alert('Please fill out all required product fields correctly.');
      return;
    }

    if (!image) {
      if (category === 'vegetables') image = 'images/fresh_vegetables.png';
      else if (category === 'wafers_snacks') image = 'images/potato_chips.png';
      else if (category === 'oil') image = 'images/sunflower_oil.png';
      else if (category === 'spices') image = 'images/spices_combo.png';
      else if (category === 'sugar_tea') image = 'images/white_sugar.png';
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
      personal: 'Personal Care',
      best_value: 'Best Value Deals'
    };

    let targetLabel = categoryLabels[category];
    if (!targetLabel) {
      const customC = customCategories.find(c => c.key === category);
      if (customC) targetLabel = customC.label;
      else targetLabel = 'Daily Essentials';
    }

    const newProdObj = {
      id: 'prod-custom-' + Date.now(),
      name: name,
      brand: brand,
      category: category,
      categoryLabel: targetLabel,
      weight: weight,
      price: price,
      unit: unit,
      availability: 'In Stock',
      badge: badge,
      featuredHero: badge === 'Hot Deal',
      image: image,
      description: `${name} by ${brand} (${weight}). Available at Shree Hanuman Super Market Warje Pune.`
    };

    if (typeof addNewProductToDataset === 'function') {
      addNewProductToDataset(newProdObj);
    } else {
      productsData.unshift(newProdObj);
    }

    if (window.CloudDB && typeof window.CloudDB.saveProduct === 'function') {
      window.CloudDB.saveProduct(newProdObj);
    }

    renderCategoryShowcases();
    renderProducts();

    closeAddProductModal();
    addProdForm.reset();
    newUploadedImageBase64 = '';
    const previewBox = document.getElementById('newProdImagePreviewBox');
    if (previewBox) previewBox.style.display = 'none';

    if (typeof showToastNotification === 'function') {
      showToastNotification(`Successfully published "${name}" to store catalog!`);
    } else {
      alert(`Product "${name}" added successfully!`);
    }
  });

  // Edit Existing Product Form Submission
  const editProdForm = document.getElementById('editProductForm');
  editProdForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const prodId = document.getElementById('editProdId').value;
    const prodIndex = productsData.findIndex(p => p.id === prodId);

    if (prodIndex === -1) {
      alert('Product not found!');
      return;
    }

    const category = document.getElementById('editProdCategory').value;
    const name = document.getElementById('editProdName').value.trim();
    const brand = document.getElementById('editProdBrand').value.trim();
    const weight = document.getElementById('editProdWeight').value.trim();
    const price = parseFloat(document.getElementById('editProdPrice').value) || 0;
    const unit = document.getElementById('editProdUnit').value;
    const badge = document.getElementById('editProdBadge').value;
    const image = editUploadedImageBase64 || document.getElementById('editProdImage').value.trim();

    // Update in-memory product
    productsData[prodIndex].category = category;
    productsData[prodIndex].name = name;
    productsData[prodIndex].brand = brand;
    productsData[prodIndex].weight = weight;
    productsData[prodIndex].price = price;
    productsData[prodIndex].unit = unit;
    productsData[prodIndex].badge = badge;
    if (image) productsData[prodIndex].image = image;

    // Persist edited product in localStorage & Cloud DB
    try {
      localStorage.setItem('shree_hanuman_custom_products_v1', JSON.stringify(productsData.filter(p => p.id.startsWith('prod-custom-'))));
      localStorage.setItem('shree_hanuman_edited_overrides_v1', JSON.stringify(productsData));
    } catch (err) {
      console.warn("Could not save edited product to localStorage", err);
    }

    if (window.CloudDB && typeof window.CloudDB.saveOverride === 'function') {
      window.CloudDB.saveOverride(productsData[prodIndex]);
    }

    // Push edited price/details to Cloud Database so all visitors worldwide see update live
    if (window.CloudDB && typeof window.CloudDB.saveOverride === 'function') {
      window.CloudDB.saveOverride(productsData[prodIndex]);
    }

    renderCategoryShowcases();
    renderProducts();

    closeEditProductModal();
    editUploadedImageBase64 = '';

    if (typeof showToastNotification === 'function') {
      showToastNotification(`Updated "${name}" successfully!`);
    } else {
      alert(`Product "${name}" updated!`);
    }
  });
});

