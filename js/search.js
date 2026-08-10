/* ==========================================================================
   SHREE HANUMAN SUPER MARKET - Live Product Search & Category Filtering
   Includes Hero Product Display & Specific Category Homepage Showcases
   Owner: Jitendra Bhanwarlal Unecha | Contact: 7083568189
   ========================================================================== */

let activeCategory = 'all';
let searchQuery = '';

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('productSearchInput');
  const filterButtons = document.querySelectorAll('.filter-btn');

  // Initial Renders
  renderHeroProducts();
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

// Render Hero Featured Products
function renderHeroProducts() {
  const heroGrid = document.getElementById('heroProductsGrid');
  if (!heroGrid) return;

  const heroItems = productsData.filter(p => p.featuredHero || p.badge === 'Hot Deal' || p.badge === 'Sulphur Free').slice(0, 3);

  heroGrid.innerHTML = heroItems.map(product => `
    <div class="hero-product-card">
      <span class="hero-card-badge">${product.badge}</span>
      <img src="${product.image}" alt="${product.name}" class="hero-card-img">
      <div class="hero-card-info">
        <h4 class="hero-card-title">${product.name}</h4>
        <div class="hero-card-sub">${product.weight}</div>
        <div class="hero-card-price-row">
          <span class="hero-card-price">₹${product.price.toLocaleString('en-IN')} <small>/ ${product.unit}</small></span>
          <button type="button" class="btn btn-cart-sm btn-ripple" onclick="addToCart('${product.id}', 1)">
            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/></svg>
            Add
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// Render Specific Category Showcase Grids on Homepage
function renderCategoryShowcases() {
  // 1. Sugar, Tea, Wheat & Rice Showcase
  const sugarTeaGrid = document.getElementById('sugarTeaGrid');
  if (sugarTeaGrid) {
    const items = productsData.filter(p => p.category === 'sugar_tea').slice(0, 4);
    sugarTeaGrid.innerHTML = renderCardMarkupList(items);
  }

  // 2. Fresh Vegetables & Fruits Showcase
  const vegGrid = document.getElementById('vegetablesGrid');
  if (vegGrid) {
    const items = productsData.filter(p => p.category === 'vegetables').slice(0, 4);
    vegGrid.innerHTML = renderCardMarkupList(items);
  }

  // 3. Wafers, Biscuits & Snacks Showcase
  const snackGrid = document.getElementById('wafersSnacksGrid');
  if (snackGrid) {
    const items = productsData.filter(p => p.category === 'wafers_snacks').slice(0, 4);
    snackGrid.innerHTML = renderCardMarkupList(items);
  }
}

// Helper to generate product card HTML snippet
function renderCardMarkupList(itemList) {
  return itemList.map(product => {
    const encodedMessage = encodeURIComponent(`Hello Jitendra Bhanwarlal Unecha,\nI would like to enquire about:\nProduct: ${product.name}\nWeight: ${product.weight}\nPrice: ₹${product.price} / ${product.unit}`);
    const whatsappUrl = `https://wa.me/917083568189?text=${encodedMessage}`;

    return `
      <div class="product-card">
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
              <div class="product-price">₹${product.price.toLocaleString('en-IN')} <span style="font-size:0.85rem; font-weight:normal; color:var(--text-secondary);">/ ${product.unit}</span></div>
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
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/>
              </svg>
              Add to Cart
            </button>
          </div>

          <div class="product-actions-sub">
            <a href="${whatsappUrl}" target="_blank" class="btn-sub-link">
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-0.999 3.648 3.742-0.981z"/></svg>
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

  container.innerHTML = renderCardMarkupList(filtered);
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
