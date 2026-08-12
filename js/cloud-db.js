/* ==========================================================================
   SHREE HANUMAN SUPER MARKET - Supabase Multi-Device Central Database Engine
   Central Source of Truth for Products, Categories, Stock, Prices & Placed Orders
   Owner: Jitendra Bhanwarlal Unecha | Contact: +91 7083568189
   ========================================================================== */

const CLOUD_DB_CONFIG = {
  enabled: true,
  supabaseUrl: 'https://ujobidqpcdxssndpaajm.supabase.co',
  supabaseAnonKey: 'sb_publishable_KI6Lkt5E9piVYhgutRxq9Q_1LTeekjy',
  syncIntervalMs: 15000 // Realtime sync polling backup every 15 seconds
};

window.CloudDB = {
  isSyncing: false,
  lastSyncedAt: null,
  isInitialized: false,

  // Helper to build headers for REST request
  getHeaders(preferHeader = 'return=representation') {
    const headers = {
      'Content-Type': 'application/json',
      'apikey': CLOUD_DB_CONFIG.supabaseAnonKey,
      'Authorization': `Bearer ${CLOUD_DB_CONFIG.supabaseAnonKey}`
    };
    if (preferHeader) {
      headers['Prefer'] = preferHeader;
    }
    return headers;
  },

  // Update UI Status Badge
  updateStatusUI(status) {
    const badge = document.getElementById('cloudSyncStatusBadge');
    if (badge) {
      if (status === 'synced') {
        badge.innerHTML = '☁️ Supabase Cloud DB: Active & Synced';
        badge.style.background = 'rgba(16, 185, 129, 0.15)';
        badge.style.borderColor = 'rgba(16, 185, 129, 0.4)';
        badge.style.color = '#059669';
      } else if (status === 'syncing') {
        badge.innerHTML = '🔄 Syncing Supabase Cloud DB...';
        badge.style.background = 'rgba(245, 158, 11, 0.15)';
        badge.style.borderColor = 'rgba(245, 158, 11, 0.4)';
        badge.style.color = '#d97706';
      } else {
        badge.innerHTML = '☁️ Local Fallback Mode';
        badge.style.background = 'rgba(99, 102, 241, 0.15)';
        badge.style.borderColor = 'rgba(99, 102, 241, 0.4)';
        badge.style.color = '#4f46e5';
      }
    }
  },

  // 1. Initial Cloud Sync & Auto-Seed Function
  async initCloudSync(onSyncComplete) {
    if (!CLOUD_DB_CONFIG.enabled) {
      if (typeof onSyncComplete === 'function') onSyncComplete(false);
      return;
    }

    this.isSyncing = true;
    this.updateStatusUI('syncing');

    let changesApplied = false;
    const baseUrl = `${CLOUD_DB_CONFIG.supabaseUrl}/rest/v1`;
    const headers = this.getHeaders();

    try {
      // A. Fetch Categories from Supabase `categories` table (or legacy `custom_categories`)
      const catRes = await fetch(`${baseUrl}/categories?select=*`, { headers, cache: 'no-cache' }).catch(() => null);
      if (catRes && catRes.ok) {
        const cloudCats = await catRes.json();
        if (Array.isArray(cloudCats) && cloudCats.length > 0) {
          cloudCats.forEach(c => {
            if (c && c.key && typeof customCategories !== 'undefined') {
              if (!customCategories.some(localC => localC.key === c.key)) {
                customCategories.push({
                  key: c.key,
                  label: c.label,
                  icon: c.icon || '🏷️',
                  badge: c.badge || 'Store Section',
                  description: c.description || ''
                });
                changesApplied = true;
              }
            }
          });
        }
      } else {
        // Fallback check legacy table
        const legacyCatRes = await fetch(`${baseUrl}/custom_categories?select=*`, { headers, cache: 'no-cache' }).catch(() => null);
        if (legacyCatRes && legacyCatRes.ok) {
          const legacyCats = await legacyCatRes.json();
          if (Array.isArray(legacyCats)) {
            legacyCats.forEach(c => {
              if (c && c.key && typeof customCategories !== 'undefined') {
                if (!customCategories.some(localC => localC.key === c.key)) {
                  customCategories.push(c);
                  changesApplied = true;
                }
              }
            });
          }
        }
      }

      // B. Fetch Products from Supabase `products` table
      const prodRes = await fetch(`${baseUrl}/products?select=*`, { headers, cache: 'no-cache' }).catch(() => null);
      if (prodRes && prodRes.ok) {
        const cloudProds = await prodRes.json();
        if (Array.isArray(cloudProds) && cloudProds.length > 0) {
          // Replace or merge into productsData runtime array
          cloudProds.forEach(p => {
            const formatted = {
              id: p.id,
              name: p.name,
              brand: p.brand || 'Hanuman Market',
              category: p.category,
              categoryLabel: p.category_label || p.categoryLabel || '',
              weight: p.weight || '1 Pack',
              price: Number(p.price) || 0,
              mrp: p.mrp ? Number(p.mrp) : null,
              unit: p.unit || 'pack',
              availability: p.availability || 'In Stock',
              badge: p.badge || '',
              featuredHero: Boolean(p.featured_hero || p.featuredHero),
              image: p.image || 'images/logo.jpg',
              description: p.description || ''
            };

            const idx = productsData.findIndex(localP => localP.id === p.id);
            if (idx !== -1) {
              // Update existing product from Supabase authoritative data
              if (JSON.stringify(productsData[idx]) !== JSON.stringify(formatted)) {
                productsData[idx] = formatted;
                changesApplied = true;
              }
            } else {
              // New product added from Supabase
              productsData.unshift(formatted);
              changesApplied = true;
            }
          });
        } else if (cloudProds.length === 0 && !this.isInitialized) {
          // Table exists but is empty - Seed initial products from static dataset into Supabase
          console.log("🌱 Seeding static products into Supabase PostgreSQL table...");
          await this.seedProductsToSupabase(productsData);
          changesApplied = true;
        }
      } else {
        // Fallback: check legacy `custom_products` & `edited_overrides` tables if primary `products` table is compiling
        await this.syncLegacyTables(baseUrl, headers);
      }

      this.isInitialized = true;
      this.lastSyncedAt = new Date();
      this.isSyncing = false;
      this.updateStatusUI('synced');

      if (typeof onSyncComplete === 'function') onSyncComplete(changesApplied);
    } catch (err) {
      console.warn("⚠️ Supabase Cloud DB connection operating in cache mode:", err);
      this.isSyncing = false;
      this.updateStatusUI('local');
      if (typeof onSyncComplete === 'function') onSyncComplete(false);
    }
  },

  // Helper: Seed initial products into Supabase
  async seedProductsToSupabase(itemList) {
    try {
      const baseUrl = `${CLOUD_DB_CONFIG.supabaseUrl}/rest/v1`;
      const headers = this.getHeaders('resolution=merge-duplicates');
      const payload = itemList.map(p => ({
        id: p.id,
        name: p.name,
        brand: p.brand,
        category: p.category,
        category_label: p.categoryLabel,
        weight: p.weight,
        price: p.price,
        mrp: p.mrp || null,
        unit: p.unit,
        availability: p.availability,
        badge: p.badge || null,
        featured_hero: Boolean(p.featuredHero),
        image: p.image,
        description: p.description
      }));

      await fetch(`${baseUrl}/products`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });
      console.log("✅ Successfully seeded catalog into Supabase `products` table!");
    } catch (e) {
      console.warn("Could not seed products to Supabase:", e);
    }
  },

  // Helper: Sync legacy custom_products & edited_overrides tables if available
  async syncLegacyTables(baseUrl, headers) {
    try {
      const prodRes = await fetch(`${baseUrl}/custom_products?select=*`, { headers, cache: 'no-cache' }).catch(() => null);
      if (prodRes && prodRes.ok) {
        const cloudProds = await prodRes.json();
        if (Array.isArray(cloudProds)) {
          cloudProds.forEach(p => {
            if (p && p.id && !productsData.some(localP => localP.id === p.id)) {
              productsData.unshift(p);
            }
          });
        }
      }

      const ovRes = await fetch(`${baseUrl}/edited_overrides?select=*`, { headers, cache: 'no-cache' }).catch(() => null);
      if (ovRes && ovRes.ok) {
        const cloudOverrides = await ovRes.json();
        if (Array.isArray(cloudOverrides)) {
          cloudOverrides.forEach(ov => {
            const idx = productsData.findIndex(p => p.id === ov.id);
            if (idx !== -1) {
              productsData[idx] = { ...productsData[idx], ...ov };
            }
          });
        }
      }
    } catch (e) {
      console.warn("Legacy table sync error:", e);
    }
  },

  // 2. Save New Product directly to Supabase
  async saveProduct(productObj) {
    try {
      const baseUrl = `${CLOUD_DB_CONFIG.supabaseUrl}/rest/v1`;
      const headers = this.getHeaders('resolution=merge-duplicates');

      const dbPayload = {
        id: String(productObj.id),
        name: productObj.name,
        brand: productObj.brand || '',
        category: productObj.category,
        category_label: productObj.categoryLabel || productObj.category,
        weight: productObj.weight || '',
        price: Number(productObj.price),
        mrp: productObj.mrp ? Number(productObj.mrp) : null,
        unit: productObj.unit || 'pack',
        availability: productObj.availability || 'In Stock',
        badge: productObj.badge || null,
        featured_hero: Boolean(productObj.featuredHero),
        image: productObj.image || 'images/logo.jpg',
        description: productObj.description || ''
      };

      // Upsert into primary `products` table
      await fetch(`${baseUrl}/products`, {
        method: 'POST',
        headers,
        body: JSON.stringify(dbPayload)
      });

      // Also insert into `custom_products` table for backward compatibility
      await fetch(`${baseUrl}/custom_products`, {
        method: 'POST',
        headers,
        body: JSON.stringify(productObj)
      }).catch(() => null);

      console.log("☁️ Published product to Supabase PostgreSQL:", productObj.name);
    } catch (e) {
      console.error("Supabase product save failed:", e);
    }
  },

  // 3. Save Edited Product Price / Details directly to Supabase
  async saveOverride(productObj) {
    try {
      const baseUrl = `${CLOUD_DB_CONFIG.supabaseUrl}/rest/v1`;
      const cleanId = String(productObj.id).replace(/[^a-zA-Z0-9_-]/g, '_');
      const headers = this.getHeaders('resolution=merge-duplicates');

      const dbPayload = {
        id: cleanId,
        name: productObj.name,
        brand: productObj.brand,
        price: Number(productObj.price),
        mrp: productObj.mrp ? Number(productObj.mrp) : null,
        weight: productObj.weight,
        badge: productObj.badge,
        availability: productObj.availability,
        unit: productObj.unit,
        category: productObj.category,
        image: productObj.image,
        description: productObj.description
      };

      // Patch/Upsert primary `products` table
      await fetch(`${baseUrl}/products?id=eq.${cleanId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(dbPayload)
      });

      // Upsert into legacy `edited_overrides` table for backward compatibility
      await fetch(`${baseUrl}/edited_overrides`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          id: cleanId,
          name: productObj.name,
          price: Number(productObj.price),
          mrp: productObj.mrp ? Number(productObj.mrp) : null,
          weight: productObj.weight,
          badge: productObj.badge,
          description: productObj.description
        })
      }).catch(() => null);

      console.log("☁️ Saved product edit directly to Supabase DB:", productObj.name);
    } catch (e) {
      console.error("Supabase product edit save failed:", e);
    }
  },

  // 4. Save Custom Category to Supabase
  async saveCategory(categoryObj) {
    try {
      const baseUrl = `${CLOUD_DB_CONFIG.supabaseUrl}/rest/v1`;
      const headers = this.getHeaders('resolution=merge-duplicates');

      const payload = {
        key: categoryObj.key,
        label: categoryObj.label,
        icon: categoryObj.icon || '🏷️',
        badge: categoryObj.badge || 'Store Section',
        description: categoryObj.description || '',
        is_custom: true
      };

      await fetch(`${baseUrl}/categories`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      await fetch(`${baseUrl}/custom_categories`, {
        method: 'POST',
        headers,
        body: JSON.stringify(categoryObj)
      }).catch(() => null);

      console.log("☁️ Saved custom category to Supabase DB:", categoryObj.label);
    } catch (e) {
      console.error("Supabase category save failed:", e);
    }
  },

  // 5. Delete Custom Category from Supabase
  async deleteCategory(categoryKey) {
    try {
      const baseUrl = `${CLOUD_DB_CONFIG.supabaseUrl}/rest/v1`;
      const cleanKey = String(categoryKey).replace(/[^a-zA-Z0-9_-]/g, '_');
      const headers = this.getHeaders();

      await fetch(`${baseUrl}/categories?key=eq.${cleanKey}`, {
        method: 'DELETE',
        headers
      });

      await fetch(`${baseUrl}/custom_categories?key=eq.${cleanKey}`, {
        method: 'DELETE',
        headers
      }).catch(() => null);

      console.log("☁️ Removed category section from Supabase DB:", categoryKey);
    } catch (e) {
      console.error("Supabase category delete failed:", e);
    }
  },

  // 6. Create Order & Line Items in Supabase Database
  async createOrder(orderData, cartItems) {
    try {
      const baseUrl = `${CLOUD_DB_CONFIG.supabaseUrl}/rest/v1`;
      const headers = this.getHeaders('return=representation');

      const orderNumber = `HSM-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const esc = (window.SecurityEngine && window.SecurityEngine.escapeHTML) ? window.SecurityEngine.escapeHTML : (s => String(s || ''));

      const orderPayload = {
        order_number: esc(orderNumber),
        customer_name: esc(orderData.name),
        customer_phone: esc(orderData.phone),
        fulfillment_type: esc(orderData.orderType || 'Home Delivery'),
        delivery_address: esc(orderData.address || ''),
        time_slot: esc(orderData.timing || ''),
        payment_method: esc(orderData.payment || 'Cash on Delivery (COD)'),
        payment_status: 'Pending',
        order_status: 'Pending',
        subtotal: Number(orderData.grandTotal) || 0,
        delivery_charge: 0,
        grand_total: Number(orderData.grandTotal) || 0,
        notes: esc(orderData.notes || '')
      };

      // A. Insert Order Header
      const orderRes = await fetch(`${baseUrl}/orders`, {
        method: 'POST',
        headers,
        body: JSON.stringify(orderPayload)
      });

      if (!orderRes.ok) {
        const errText = await orderRes.text();
        console.warn("Could not insert order header into Supabase:", errText);
        return { success: false, orderNumber };
      }

      const insertedOrders = await orderRes.json();
      const orderId = insertedOrders[0]?.id;

      // B. Insert Line Items if order header succeeded
      if (orderId && Array.isArray(cartItems) && cartItems.length > 0) {
        const itemHeaders = this.getHeaders('');
        const lineItemsPayload = cartItems.map(item => ({
          order_id: orderId,
          product_id: item.id,
          product_name: item.name,
          brand: item.brand || '',
          weight: item.weight || '',
          unit_price: item.price,
          quantity: item.qty,
          subtotal: item.price * item.qty
        }));

        await fetch(`${baseUrl}/order_items`, {
          method: 'POST',
          headers: itemHeaders,
          body: JSON.stringify(lineItemsPayload)
        }).catch(err => console.warn("Error creating line items in Supabase:", err));
      }

      console.log("✅ Order & Line Items saved to Supabase PostgreSQL database!", orderNumber);
      return { success: true, orderNumber, orderId };
    } catch (e) {
      console.error("Supabase order creation exception:", e);
      return { success: false, orderNumber: `HSM-${Date.now()}` };
    }
  },

  // 7. Fetch All Orders (For Owner / Admin Order Dashboard)
  async fetchOrders() {
    try {
      const baseUrl = `${CLOUD_DB_CONFIG.supabaseUrl}/rest/v1`;
      const headers = this.getHeaders();
      const res = await fetch(`${baseUrl}/orders?select=*,order_items(*)&order=created_at.desc`, { headers, cache: 'no-cache' });
      if (res.ok) {
        return await res.json();
      }
      return [];
    } catch (e) {
      console.warn("Fetch orders error:", e);
      return [];
    }
  }
};

// Auto Background Realtime Sync
if (CLOUD_DB_CONFIG.enabled) {
  setInterval(() => {
    if (window.CloudDB && typeof window.CloudDB.initCloudSync === 'function') {
      window.CloudDB.initCloudSync((changed) => {
        if (changed && typeof renderProducts === 'function') {
          if (typeof updateCategoryDropdownsAndFilters === 'function') updateCategoryDropdownsAndFilters();
          if (typeof renderCategoryShowcases === 'function') renderCategoryShowcases();
          renderProducts();
        }
      });
    }
  }, CLOUD_DB_CONFIG.syncIntervalMs);

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && window.CloudDB) {
      window.CloudDB.initCloudSync((changed) => {
        if (changed && typeof renderProducts === 'function') {
          if (typeof updateCategoryDropdownsAndFilters === 'function') updateCategoryDropdownsAndFilters();
          if (typeof renderCategoryShowcases === 'function') renderCategoryShowcases();
          renderProducts();
        }
      });
    }
  });
}
