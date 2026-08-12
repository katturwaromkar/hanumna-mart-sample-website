/* ==========================================================================
   SHREE HANUMAN SUPER MARKET - Cloud Database Realtime Synchronization Engine
   Option 2: Cloud Database Integration (Supabase / Firebase Realtime Database)
   Syncs added products, price edits, and custom sections live across all devices worldwide.
   Owner: Jitendra Bhanwarlal Unecha | Contact: +91 7083568189
   ========================================================================== */

// Cloud Database Configuration
const CLOUD_DB_CONFIG = {
  enabled: true,
  provider: 'supabase', // 'supabase' or 'firebase'
  
  // Supabase Configuration
  supabaseUrl: 'https://ujobidqpcdxssndpaajm.supabase.co',
  supabaseAnonKey: 'sb_publishable_KI6Lkt5E9piVYhgutRxq9Q_1LTeekjy', // Supabase Publishable Key

  // Firebase Realtime Database Endpoint Fallback
  firebaseUrl: 'https://shree-hanuman-market-default-rtdb.asia-southeast1.firebasedatabase.app',

  // Realtime background sync interval (every 30 seconds)
  syncIntervalMs: 30000
};

// Global Cloud Sync Controller
window.CloudDB = {
  isSyncing: false,
  lastSyncedAt: null,

  // Helper to build headers for REST request
  getHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    if (CLOUD_DB_CONFIG.provider === 'supabase' && CLOUD_DB_CONFIG.supabaseAnonKey) {
      headers['apikey'] = CLOUD_DB_CONFIG.supabaseAnonKey;
      headers['Authorization'] = `Bearer ${CLOUD_DB_CONFIG.supabaseAnonKey}`;
      headers['Prefer'] = 'return=representation';
    }
    return headers;
  },

  // Update UI Sync Badge if available
  updateStatusUI(status) {
    const badge = document.getElementById('cloudSyncStatusBadge');
    if (badge) {
      if (status === 'synced') {
        badge.innerHTML = '☁️ Supabase Cloud Sync: Active';
        badge.style.background = 'rgba(16, 185, 129, 0.15)';
        badge.style.borderColor = 'rgba(16, 185, 129, 0.4)';
        badge.style.color = '#059669';
      } else if (status === 'syncing') {
        badge.innerHTML = '🔄 Syncing Supabase Cloud...';
        badge.style.background = 'rgba(245, 158, 11, 0.15)';
        badge.style.borderColor = 'rgba(245, 158, 11, 0.4)';
        badge.style.color = '#d97706';
      } else {
        badge.innerHTML = '☁️ Local Fallback Active';
        badge.style.background = 'rgba(99, 102, 241, 0.15)';
        badge.style.borderColor = 'rgba(99, 102, 241, 0.4)';
        badge.style.color = '#4f46e5';
      }
    }
  },

  // 1. Fetch Cloud Data on Page Load for All Visitors Worldwide
  async initCloudSync(onSyncComplete) {
    if (!CLOUD_DB_CONFIG.enabled) {
      if (typeof onSyncComplete === 'function') onSyncComplete(false);
      return;
    }

    this.isSyncing = true;
    this.updateStatusUI('syncing');
    console.log("☁️ Initializing Supabase Cloud DB sync for project:", CLOUD_DB_CONFIG.supabaseUrl);

    let changesApplied = false;

    try {
      const isSupa = CLOUD_DB_CONFIG.provider === 'supabase';
      const baseUrl = isSupa ? `${CLOUD_DB_CONFIG.supabaseUrl}/rest/v1` : CLOUD_DB_CONFIG.firebaseUrl;
      const headers = this.getHeaders();

      // A. Fetch custom sections
      const catUrl = isSupa ? `${baseUrl}/custom_categories?select=*` : `${baseUrl}/custom_categories.json`;
      const catRes = await fetch(catUrl, { headers, cache: 'no-cache' }).catch(() => null);
      if (catRes && catRes.ok) {
        const cloudCats = await catRes.json();
        if (cloudCats && typeof cloudCats === 'object') {
          const catList = Array.isArray(cloudCats) ? cloudCats : Object.values(cloudCats);
          catList.forEach(c => {
            if (c && c.key && typeof customCategories !== 'undefined') {
              if (!customCategories.some(localC => localC.key === c.key)) {
                customCategories.push(c);
                changesApplied = true;
              }
            }
          });
        }
      }

      // B. Fetch custom products
      const prodUrl = isSupa ? `${baseUrl}/custom_products?select=*` : `${baseUrl}/custom_products.json`;
      const prodRes = await fetch(prodUrl, { headers, cache: 'no-cache' }).catch(() => null);
      if (prodRes && prodRes.ok) {
        const cloudProds = await prodRes.json();
        if (cloudProds && typeof cloudProds === 'object') {
          const prodList = Array.isArray(cloudProds) ? cloudProds : Object.values(cloudProds);
          prodList.forEach(p => {
            if (p && p.id && typeof productsData !== 'undefined') {
              if (!productsData.some(localP => localP.id === p.id)) {
                productsData.unshift(p);
                changesApplied = true;
              }
            }
          });
        }
      }

      // C. Fetch edited price/product overrides
      const ovUrl = isSupa ? `${baseUrl}/edited_overrides?select=*` : `${baseUrl}/edited_overrides.json`;
      const ovRes = await fetch(ovUrl, { headers, cache: 'no-cache' }).catch(() => null);
      if (ovRes && ovRes.ok) {
        const cloudOverrides = await ovRes.json();
        if (cloudOverrides && typeof cloudOverrides === 'object') {
          const ovList = Array.isArray(cloudOverrides) ? cloudOverrides : Object.values(cloudOverrides);
          ovList.forEach(ov => {
            if (ov && ov.id && typeof productsData !== 'undefined') {
              const idx = productsData.findIndex(p => p.id === ov.id);
              if (idx !== -1) {
                productsData[idx] = { ...productsData[idx], ...ov };
                changesApplied = true;
              }
            }
          });
        }
      }

      this.lastSyncedAt = new Date();
      this.isSyncing = false;
      this.updateStatusUI('synced');
      console.log("✅ Supabase Cloud DB sync completed! Store synced worldwide.");

      if (typeof onSyncComplete === 'function') onSyncComplete(changesApplied);
    } catch (err) {
      console.warn("⚠️ Cloud DB operating with local cache fallback.", err);
      this.isSyncing = false;
      this.updateStatusUI('local');
      if (typeof onSyncComplete === 'function') onSyncComplete(false);
    }
  },

  // 2. Save New Custom Section to Cloud DB
  async saveCategory(categoryObj) {
    try {
      const isSupa = CLOUD_DB_CONFIG.provider === 'supabase';
      const url = isSupa 
        ? `${CLOUD_DB_CONFIG.supabaseUrl}/rest/v1/custom_categories` 
        : `${CLOUD_DB_CONFIG.firebaseUrl}/custom_categories.json`;

      await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(categoryObj)
      });
      console.log("☁️ Custom section published to Supabase Cloud DB:", categoryObj.label);
    } catch (e) {
      console.warn("Cloud DB category save pending network:", e);
    }
  },

  // 3. Save New Product to Cloud DB for All Customers
  async saveProduct(productObj) {
    try {
      const isSupa = CLOUD_DB_CONFIG.provider === 'supabase';
      const url = isSupa 
        ? `${CLOUD_DB_CONFIG.supabaseUrl}/rest/v1/custom_products` 
        : `${CLOUD_DB_CONFIG.firebaseUrl}/custom_products.json`;

      await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(productObj)
      });
      console.log("☁️ Product published to Supabase Cloud DB for all users worldwide:", productObj.name);
    } catch (e) {
      console.warn("Cloud DB product save pending network:", e);
    }
  },

  // 4. Save Edited Product Overrides to Cloud DB for All Customers
  async saveOverride(productObj) {
    try {
      const isSupa = CLOUD_DB_CONFIG.provider === 'supabase';
      const cleanId = String(productObj.id).replace(/[^a-zA-Z0-9_-]/g, '_');
      
      const url = isSupa 
        ? `${CLOUD_DB_CONFIG.supabaseUrl}/rest/v1/edited_overrides?id=eq.${cleanId}` 
        : `${CLOUD_DB_CONFIG.firebaseUrl}/edited_overrides/${cleanId}.json`;

      const headers = this.getHeaders();
      if (isSupa) headers['Prefer'] = 'resolution=merge-duplicates';

      await fetch(url, {
        method: isSupa ? 'POST' : 'PUT',
        headers,
        body: JSON.stringify(productObj)
      });
      console.log("☁️ Price & details edit published to Supabase Cloud DB live:", productObj.name);
    } catch (e) {
      console.warn("Cloud DB edit save pending network:", e);
    }
  },

  // 5. Delete Custom Category Section from Cloud DB
  async deleteCategory(categoryKey) {
    try {
      const isSupa = CLOUD_DB_CONFIG.provider === 'supabase';
      const cleanKey = String(categoryKey).replace(/[^a-zA-Z0-9_-]/g, '_');

      const url = isSupa 
        ? `${CLOUD_DB_CONFIG.supabaseUrl}/rest/v1/custom_categories?key=eq.${cleanKey}` 
        : `${CLOUD_DB_CONFIG.firebaseUrl}/custom_categories/${cleanKey}.json`;

      await fetch(url, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
      console.log("☁️ Custom section removed from Cloud DB:", categoryKey);
    } catch (e) {
      console.warn("Cloud DB delete section failed:", e);
    }
  }
};

// Auto Periodic Sync every 30 seconds & on tab visibility refocus
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
