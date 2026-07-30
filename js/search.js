/* ==========================================================================
   V & B ENTERPRISES - Live Product Search & Category Filtering
   Owner: Basheer Sayed | Contact: 8411821767
   ========================================================================== */

let activeCategory = 'all';
let searchQuery = '';

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('productSearchInput');
  const filterButtons = document.querySelectorAll('.filter-btn');

  // Initial Render
  renderProducts();

  // Search Input Listener
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderProducts();
    });
  }

  // Category Buttons Listener
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      activeCategory = button.getAttribute('data-category');
      renderProducts();
    });
  });
});

// Function to Filter and Render Products
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
        <p style="font-size:0.9rem; color:var(--text-secondary);">Try adjusting your search query or switching category filters.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(product => {
    const encodedMessage = encodeURIComponent(`Hello Basheer Sayed,\nI would like to enquire about wholesale pricing for:\nProduct: ${product.name}\nBrand: ${product.brand}\nPack: ${product.weight}\nCurrent Wholesale Price: ₹${product.price} / ${product.unit}`);
    const whatsappUrl = `https://wa.me/918411821767?text=${encodedMessage}`;
    const phoneUrl = `tel:8411821767`;

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
              <span class="price-label">Wholesale Price</span>
              <div class="product-price">₹${product.price.toLocaleString('en-IN')} <span style="font-size:0.85rem; font-weight:normal; color:var(--text-secondary);">/ ${product.unit}</span></div>
            </div>
            <span style="font-size:0.75rem; background:rgba(255,184,0,0.15); color:var(--accent-color); padding:0.2rem 0.6rem; border-radius:4px; font-weight:600; border:1px solid rgba(255,184,0,0.3);">
              ${product.availability}
            </span>
          </div>
          <div class="product-actions">
            <a href="${whatsappUrl}" target="_blank" class="btn btn-whatsapp btn-sm">
              <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-0.999 3.648 3.742-0.981z"/></svg>
              WhatsApp
            </a>
            <a href="${phoneUrl}" class="btn btn-primary btn-sm">
              <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
              Call Now
            </a>
          </div>
        </div>
      </div>
    `;
  }).join('');
}
