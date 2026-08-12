/* ==========================================================================
   SHREE HANUMAN SUPER MARKET - Shopping Cart & Order System
   Owner: Jitendra Bhawarlal unecha | Contact: 7083568189
   ========================================================================== */

const CART_STORAGE_KEY = 'shree_hanuman_cart_v1';

// Initial state load
let cartState = [];

try {
  const savedCart = localStorage.getItem(CART_STORAGE_KEY);
  if (savedCart) {
    cartState = JSON.parse(savedCart);
  }
} catch (e) {
  cartState = [];
}

// Save cart to local storage
function saveCartState() {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartState));
  } catch (e) {
    console.error("Could not save cart state", e);
  }
  updateCartUI();
}

// Add item to cart
function addToCart(productId, quantity = 1) {
  const product = productsData.find(p => p.id === productId);
  if (!product) return;

  const existingItemIndex = cartState.findIndex(item => item.id === productId);

  if (existingItemIndex > -1) {
    cartState[existingItemIndex].qty += quantity;
  } else {
    cartState.push({
      id: product.id,
      name: product.name,
      brand: product.brand,
      weight: product.weight,
      price: product.price,
      unit: product.unit,
      image: product.image,
      qty: quantity
    });
  }

  saveCartState();
  showToastNotification(`Added "${product.name}" to your cart!`);
}

// Update item quantity directly
function updateItemQuantity(productId, newQty) {
  const qty = parseInt(newQty, 10);
  const index = cartState.findIndex(item => item.id === productId);
  if (index > -1) {
    if (qty <= 0) {
      cartState.splice(index, 1);
    } else {
      cartState[index].qty = qty;
    }
    saveCartState();
  }
}

// Remove item from cart
function removeFromCart(productId) {
  cartState = cartState.filter(item => item.id !== productId);
  saveCartState();
}

// Clear whole cart
function clearCart() {
  cartState = [];
  saveCartState();
}

// Calculate total cart price
function getCartTotal() {
  return cartState.reduce((total, item) => total + (item.price * item.qty), 0);
}

// Calculate total cart items count
function getCartCount() {
  return cartState.reduce((total, item) => total + item.qty, 0);
}

// Toast notification helper
function showToastNotification(message) {
  let toastContainer = document.getElementById('cartToastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'cartToastContainer';
    toastContainer.className = 'cart-toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'cart-toast animate-slide-in';
  toast.innerHTML = `
    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
    </svg>
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 400);
  }, 2500);
}

// Update UI elements (Cart Badges, Drawer Content)
function updateCartUI() {
  const cartCount = getCartCount();
  const cartTotal = getCartTotal();

  // Header Cart Badge & Label
  const headerCartBadge = document.getElementById('headerCartBadge');
  const headerCartTotal = document.getElementById('headerCartTotal');
  const floatCartBadge = document.getElementById('floatCartBadge');

  if (headerCartBadge) headerCartBadge.textContent = cartCount;
  if (headerCartTotal) headerCartTotal.textContent = `₹${cartTotal.toLocaleString('en-IN')}`;
  if (floatCartBadge) floatCartBadge.textContent = cartCount;

  // Render Cart Drawer List
  const drawerItemsContainer = document.getElementById('cartDrawerItems');
  const drawerSubtotal = document.getElementById('cartDrawerSubtotal');
  const drawerGrandTotal = document.getElementById('cartDrawerGrandTotal');
  const checkoutBtn = document.getElementById('cartCheckoutBtn');

  if (drawerSubtotal) drawerSubtotal.textContent = `₹${cartTotal.toLocaleString('en-IN')}`;
  if (drawerGrandTotal) drawerGrandTotal.textContent = `₹${cartTotal.toLocaleString('en-IN')}`;

  if (checkoutBtn) {
    checkoutBtn.disabled = cartState.length === 0;
  }

  // Sync product card button states across page
  const addTxt = window.i18n ? window.i18n.t('addToCart') : 'Add to Cart';
  const addedTxt = window.i18n ? window.i18n.t('addedToCart') : '✓ Added';

  document.querySelectorAll('.product-card').forEach(card => {
    const prodId = card.getAttribute('data-id');
    const btn = card.querySelector('.btn-cart');
    if (!prodId || !btn) return;

    const isInCart = cartState.some(item => item.id === prodId);
    if (isInCart) {
      btn.classList.add('btn-cart-added');
      btn.innerHTML = `
        <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
        </svg>
        ${addedTxt}
      `;
    } else {
      btn.classList.remove('btn-cart-added');
      btn.innerHTML = `
        <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/>
        </svg>
        ${addTxt}
      `;
    }
  });

  if (drawerItemsContainer) {
    if (cartState.length === 0) {
      drawerItemsContainer.innerHTML = `
        <div class="empty-cart-view">
          <svg width="56" height="56" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/>
          </svg>
          <h4>Your Cart is Empty</h4>
          <p>Add fresh daily groceries and essentials from our catalog to place your order.</p>
          <a href="#products" class="btn btn-primary btn-sm" onclick="closeCartDrawer();">Explore Products</a>
        </div>
      `;
    } else {
      drawerItemsContainer.innerHTML = cartState.map(item => `
        <div class="cart-item-row" data-id="${item.id}">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img">
          <div class="cart-item-details">
            <div class="cart-item-title">${item.name}</div>
            <div class="cart-item-sub">${item.weight}</div>
            <div class="cart-item-price-unit">₹${item.price.toLocaleString('en-IN')} / ${item.unit}</div>
          </div>
          <div class="cart-item-actions">
            <div class="qty-control-sm">
              <button type="button" onclick="updateItemQuantity('${item.id}', ${item.qty - 1})">-</button>
              <span>${item.qty}</span>
              <button type="button" onclick="updateItemQuantity('${item.id}', ${item.qty + 1})">+</button>
            </div>
            <div class="cart-item-total">₹${(item.price * item.qty).toLocaleString('en-IN')}</div>
            <button type="button" class="remove-cart-item-btn" onclick="removeFromCart('${item.id}')" title="Remove Item">
              &times;
            </button>
          </div>
        </div>
      `).join('');
    }
  }
}

// Modal & Drawer Control Functions
function openCartDrawer() {
  const drawer = document.getElementById('cartDrawerModal');
  if (drawer) {
    drawer.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeCartDrawer() {
  const drawer = document.getElementById('cartDrawerModal');
  if (drawer) {
    drawer.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function openCheckoutModal() {
  if (cartState.length === 0) {
    showToastNotification("Your cart is empty! Please add items before checkout.");
    return;
  }
  closeCartDrawer();

  const checkoutModal = document.getElementById('checkoutOrderModal');
  if (checkoutModal) {
    // Render Order Summary in Modal
    const summaryContainer = document.getElementById('checkoutOrderSummaryList');
    const totalSpan = document.getElementById('checkoutOrderModalTotal');
    const countSpan = document.getElementById('checkoutSummaryCount');

    if (summaryContainer) {
      summaryContainer.innerHTML = cartState.map(item => `
        <div class="checkout-summary-item">
          <span>${item.name} (${item.weight}) &times; ${item.qty}</span>
          <strong>₹${(item.price * item.qty).toLocaleString('en-IN')}</strong>
        </div>
      `).join('');
    }

    if (totalSpan) {
      totalSpan.textContent = `₹${getCartTotal().toLocaleString('en-IN')}`;
    }

    closeCartDrawer();
    checkoutModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeCheckoutModal() {
  const checkoutModal = document.getElementById('checkoutOrderModal');
  if (checkoutModal) {
    checkoutModal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Disables Store Pickup location input when user chooses Takeaway
function handleOrderTypeChange(val) {
  const addressInput = document.getElementById('custAddress');
  const addressLabel = document.getElementById('custAddressLabel');
  const timingLabel = document.getElementById('custTimingLabel');

  if (val && (val.includes('Takeaway') || val.includes('Pickup'))) {
    if (addressLabel) addressLabel.textContent = 'Store Pickup Location (Auto-Disabled for Takeaway)';
    if (addressInput) {
      addressInput.value = 'N/A - Self Store Pickup at Tapodham Corner, Warje, Pune';
      addressInput.disabled = true;
      addressInput.classList.add('form-input-disabled');
    }
    if (timingLabel) timingLabel.textContent = 'Preferred Pickup Slot *';
  } else {
    if (addressLabel) addressLabel.textContent = 'Delivery Address in Pune *';
    if (addressInput) {
      if (addressInput.value.includes('N/A - Self Store Pickup')) {
        addressInput.value = '';
      }
      addressInput.disabled = false;
      addressInput.classList.remove('form-input-disabled');
      addressInput.placeholder = 'e.g. Flat 302, Sai Heights, Tapodham Corner, Warje, Pune';
    }
    if (timingLabel) timingLabel.textContent = 'Preferred Delivery Slot *';
  }
}

// Online Payment Toggle Handler
window.handleToggleOnlinePayment = function(isOnlineOn) {
  try {
    localStorage.setItem('hsm_online_payment_enabled', isOnlineOn ? 'true' : 'false');
    if (typeof showToastNotification === 'function') {
      showToastNotification(`Online UPI Payment mode is now: ${isOnlineOn ? 'ENABLED (ON)' : 'DISABLED (OFF)'}`);
    } else {
      alert(`Online UPI Payment mode is now: ${isOnlineOn ? 'ENABLED (ON)' : 'DISABLED (OFF)'}`);
    }
  } catch (e) {
    console.warn("Could not set online payment status", e);
  }
};

let lastOrderSubmitTimestamp = 0;

// Form Submit Handler for Order Placement via WhatsApp & Receipt Generation
function handleCheckoutOrderSubmit(e) {
  e.preventDefault();

  // Rate-limiting check (10-second cooldown between submissions)
  const nowTime = Date.now();
  if (nowTime - lastOrderSubmitTimestamp < 10000) {
    const remainingSec = Math.ceil((10000 - (nowTime - lastOrderSubmitTimestamp)) / 1000);
    alert(`⏳ Security Rate Limiter: Please wait ${remainingSec} seconds before placing another order.`);
    return;
  }

  if (cartState.length === 0) {
    showToastNotification("Your cart is empty!");
    return;
  }

  const esc = (window.SecurityEngine && window.SecurityEngine.escapeHTML) ? window.SecurityEngine.escapeHTML : (s => s);
  const orderType = esc(document.getElementById('custOrderType')?.value || 'Home Delivery');
  const rawName = document.getElementById('custName').value.trim();
  const rawPhone = document.getElementById('custPhone').value.trim();
  let rawAddress = document.getElementById('custAddress').value.trim();
  const timing = esc(document.getElementById('custTiming').value);
  const payment = esc(document.getElementById('custPayment').value);
  const notes = esc(document.getElementById('custNotes').value.trim());

  // Strict 10-digit Indian Mobile Regex Validation
  const cleanPhone = rawPhone.replace(/[\s\-\+\(\)]/g, '');
  const mobileRegex = /^[6-9]\d{9}$/;
  if (!mobileRegex.test(cleanPhone)) {
    alert("❌ Please enter a valid 10-digit Indian Mobile Number starting with 6, 7, 8, or 9 (e.g. 9876543210).");
    const phoneInput = document.getElementById('custPhone');
    if (phoneInput) phoneInput.focus();
    return;
  }

  if (orderType.includes('Takeaway') || !rawAddress) {
    rawAddress = "Self Store Pickup (Tapodham Corner, Tapodham Society, Near Jijai Garden, Warje, Pune - 411058)";
  }

  if (!rawName) {
    alert("Please enter your Customer Name.");
    return;
  }

  // Update submission timestamp for rate limiter
  lastOrderSubmitTimestamp = nowTime;

  const name = esc(rawName);
  const phone = esc(cleanPhone);
  const address = esc(rawAddress);

  // Auto-save customer delivery profile for repeat fast checkout
  try {
    localStorage.setItem('hsm_cust_profile', JSON.stringify({ name: rawName, phone: cleanPhone, address: rawAddress }));
  } catch (e) {}

  // Calculate Subtotal, Delivery Fee & Grand Total
  const subtotal = getCartTotal();
  const minOrderValue = 199;
  let deliveryFee = 0;

  if (!orderType.includes('Takeaway') && subtotal < minOrderValue && subtotal > 0) {
    deliveryFee = 25; // ₹25 nominal delivery charge below ₹199
  }

  const grandTotal = subtotal + deliveryFee;
  const dateStr = new Date().toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  // Incremental Receipt Counter starting strictly from 1
  let currentCounter = parseInt(localStorage.getItem('hsm_receipt_counter') || '1', 10);
  if (isNaN(currentCounter) || currentCounter < 1) {
    currentCounter = 1;
  }
  const orderNumber = `HSM-${String(currentCounter).padStart(4, '0')}`;
  localStorage.setItem('hsm_receipt_counter', currentCounter + 1);

  // Construct WhatsApp formatted Receipt String for Store Owner (+91 7083568189)
  let waReceipt = `===================================\n`;
  waReceipt += `SHRI HANUMAN SUPER MARKET - TAX INVOICE\n`;
  waReceipt += `===================================\n`;
  waReceipt += `Invoice No: ${orderNumber} (#${currentCounter})\n`;
  waReceipt += `Date: ${dateStr}\n`;
  waReceipt += `Fulfillment: ${orderType}\n\n`;
  waReceipt += `CUSTOMER DETAILS:\n`;
  waReceipt += `Name: ${name}\n`;
  waReceipt += `Phone: ${phone}\n`;
  waReceipt += `Fulfillment/Address: ${address}\n`;
  waReceipt += `Slot: ${timing}\n`;
  waReceipt += `Payment Method: ${payment}\n`;
  if (notes) waReceipt += `Notes: ${notes}\n`;

  waReceipt += `\nITEMIZED INVOICE:\n`;
  cartState.forEach((item, idx) => {
    waReceipt += `${idx + 1}. ${item.name} (${item.weight}) x ${item.qty} ${item.unit} @ Rs.${item.price} = Rs.${item.price * item.qty}\n`;
  });

  waReceipt += `\n===================================\n`;
  waReceipt += `Subtotal: Rs.${grandTotal.toLocaleString('en-IN')}\n`;
  waReceipt += `Delivery Charge: FREE (Rs.0)\n`;
  waReceipt += `TOTAL PAYABLE AMOUNT: Rs.${grandTotal.toLocaleString('en-IN')}\n`;
  waReceipt += `===================================\n\n`;
  waReceipt += `Store Location: Tapodham Corner, Near Jijai Garden, Warje, Pune 411058\n`;
  waReceipt += `Proprietor: Jitendra Bhawarlal unecha (+91 7083568189)`;

  const encodedUrl = `https://wa.me/917083568189?text=${encodeURIComponent(waReceipt)}`;

  // Save order header & line items directly into Supabase PostgreSQL Database
  const orderPayload = {
    name,
    phone,
    orderType,
    address,
    timing,
    payment,
    notes,
    grandTotal,
    orderNumber
  };

  if (window.CloudDB && typeof window.CloudDB.createOrder === 'function') {
    window.CloudDB.createOrder(orderPayload, cartState).catch(err => console.warn("Supabase order recording warning:", err));
  }

  // Populate Receipt Modal UI Elements
  const receiptInvoiceNum = document.getElementById('receiptInvoiceNum');
  const stepInvoiceNum = document.getElementById('stepInvoiceNum');
  const receiptDate = document.getElementById('receiptDate');
  const receiptCustName = document.getElementById('receiptCustName');
  const receiptCustPhone = document.getElementById('receiptCustPhone');
  const receiptOrderType = document.getElementById('receiptOrderType');
  const receiptCustAddress = document.getElementById('receiptCustAddress');
  const receiptCustSlot = document.getElementById('receiptCustSlot');
  const receiptCustPayment = document.getElementById('receiptCustPayment');
  const receiptTableBody = document.getElementById('receiptTableBody');
  const receiptSubtotal = document.getElementById('receiptSubtotal');
  const receiptGrandTotal = document.getElementById('receiptGrandTotal');
  const receiptWhatsappLink = document.getElementById('receiptWhatsappLink');
  const receiptUpiQrContainer = document.getElementById('receiptUpiQrContainer');

  if (receiptInvoiceNum) receiptInvoiceNum.textContent = orderNumber;
  if (stepInvoiceNum) stepInvoiceNum.textContent = orderNumber;
  if (receiptDate) receiptDate.textContent = dateStr;
  if (receiptCustName) receiptCustName.textContent = name;
  if (receiptCustPhone) receiptCustPhone.textContent = phone;
  if (receiptOrderType) receiptOrderType.textContent = orderType;
  if (receiptCustAddress) receiptCustAddress.textContent = address;
  if (receiptCustSlot) receiptCustSlot.textContent = timing;
  if (receiptCustPayment) receiptCustPayment.textContent = payment;
  if (receiptSubtotal) receiptSubtotal.textContent = `₹${grandTotal.toLocaleString('en-IN')}`;
  if (receiptGrandTotal) receiptGrandTotal.textContent = `₹${grandTotal.toLocaleString('en-IN')}`;
  if (receiptWhatsappLink) receiptWhatsappLink.href = encodedUrl;

  // Check Admin Online Payment Toggle status (default false/OFF)
  const isOnlinePaymentEnabled = localStorage.getItem('hsm_online_payment_enabled') === 'true';

  if (receiptUpiQrContainer) {
    if (isOnlinePaymentEnabled) {
      const upiVpa = "7083568189@upi";
      const upiPayUrl = `upi://pay?pa=${upiVpa}&pn=Shri%20Hanuman%20Super%20Market&am=${grandTotal}&tn=Order%20${orderNumber}&cu=INR`;
      const qrImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiPayUrl)}`;

      receiptUpiQrContainer.innerHTML = `
        <div style="text-align:center; padding:0.6rem; background:#FFF8F3; border:1px dashed var(--primary-color); border-radius:8px; margin-top:0.75rem;" class="no-print">
          <div style="font-weight:700; font-size:0.8rem; color:var(--primary-color); margin-bottom:0.3rem;">📲 Scan to Pay via GooglePay / PhonePe / Paytm / BHIM</div>
          <img src="${qrImgUrl}" alt="UPI Payment QR Code" style="width:120px; height:120px; margin:0 auto 0.3rem; border-radius:6px; border:2px solid #FFFFFF; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
          <div style="font-size:0.76rem; font-weight:700; color:var(--text-primary);">UPI ID: ${upiVpa}</div>
          <a href="${upiPayUrl}" class="btn btn-sm" style="display:inline-block; margin-top:0.35rem; background:#4285F4; color:#FFF; font-size:0.75rem; padding:0.3rem 0.75rem; border-radius:15px; text-decoration:none;">⚡ One-Tap Pay via UPI App</a>
        </div>
      `;
    } else {
      receiptUpiQrContainer.innerHTML = '';
    }
  }

  if (receiptTableBody) {
    receiptTableBody.innerHTML = cartState.map((item, idx) => `
      <tr style="border-bottom:1px solid var(--border-color);">
        <td style="padding:0.45rem 0.6rem; font-weight:600; color:var(--text-secondary);">${idx + 1}</td>
        <td style="padding:0.45rem 0.6rem;">
          <strong style="color:var(--text-primary); font-size:0.85rem;">${item.name}</strong>
          <div style="font-size:0.75rem; color:var(--text-secondary);">${item.brand} | ${item.weight}</div>
        </td>
        <td style="padding:0.45rem 0.6rem; text-align:center; font-weight:700;">${item.qty}</td>
        <td style="padding:0.45rem 0.6rem; text-align:right;">₹${item.price.toLocaleString('en-IN')}</td>
        <td style="padding:0.45rem 0.6rem; text-align:right; font-weight:700; color:var(--primary-color);">₹${(item.price * item.qty).toLocaleString('en-IN')}</td>
      </tr>
    `).join('');
  }

  // Clear cart & close checkout form
  clearCart();
  closeCheckoutModal();

  // Show Toast & FIRST open Tax Invoice Receipt Modal (NO auto-redirect to WhatsApp!)
  showToastNotification(`🎉 Receipt ${orderNumber} generated!`);
  openReceiptModal();
}

// Receipt Modal Controls & Print Function
function openReceiptModal() {
  const modal = document.getElementById('orderReceiptModal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeReceiptModal() {
  const modal = document.getElementById('orderReceiptModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function printOrderReceipt() {
  window.print();
}

// DOM Event Listeners initialization
document.addEventListener('DOMContentLoaded', () => {
  updateCartUI();

  // Checkout Form Submit Handler
  const orderForm = document.getElementById('checkoutOrderForm');
  if (orderForm) {
    orderForm.addEventListener('submit', handleCheckoutOrderSubmit);
  }
});
