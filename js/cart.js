/* ==========================================================================
   SHREE HANUMAN SUPER MARKET - Shopping Cart & Order System
   Owner: Jitendra Bhanwarlal Unecha | Contact: 7083568189
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

    if (countSpan) {
      countSpan.textContent = `${getCartCount()} items (${cartState.length} types)`;
    }

    if (totalSpan) {
      totalSpan.textContent = `₹${getCartTotal().toLocaleString('en-IN')}`;
    }

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

// Form Submit Handler for Order Placement via WhatsApp
function handleCheckoutOrderSubmit(e) {
  e.preventDefault();

  if (cartState.length === 0) {
    showToastNotification("Your cart is empty!");
    return;
  }

  const name = document.getElementById('custName').value.trim();
  const phone = document.getElementById('custPhone').value.trim();
  const address = document.getElementById('custAddress').value.trim();
  const timing = document.getElementById('custTiming').value;
  const payment = document.getElementById('custPayment').value;
  const notes = document.getElementById('custNotes').value.trim();

  if (!name || !phone || !address) {
    alert("Please fill in your Name, Phone Number, and Delivery Address.");
    return;
  }

  // Construct itemized list
  let itemsListText = cartState.map((item, index) => {
    return `${index + 1}. ${item.name} (${item.weight}) - Qty: ${item.qty} ${item.unit} | Rate: ₹${item.price} | Subtotal: ₹${item.price * item.qty}`;
  }).join('\n');

  const grandTotal = getCartTotal();

  // WhatsApp formatted string - Professional, clean format with no extra decoration
  let message = `New Grocery Order - Shree Hanuman Super Market\n\n`;
  message += `Customer Details:\n`;
  message += `Name: ${name}\n`;
  message += `Phone: ${phone}\n`;
  message += `Delivery Address: ${address}\n`;
  message += `Delivery Slot: ${timing}\n`;
  message += `Payment Option: ${payment}\n`;
  if (notes) {
    message += `Order Notes: ${notes}\n`;
  }
  message += `\nOrdered Items:\n`;
  message += itemsListText;
  message += `\n\nTotal Payable Amount: ₹${grandTotal.toLocaleString('en-IN')}\n\n`;
  message += `Please confirm order availability and delivery time slot.`;

  const encodedUrl = `https://wa.me/917083568189?text=${encodeURIComponent(message)}`;

  // Clear cart after submitting
  clearCart();
  closeCheckoutModal();

  // Show success modal or toast
  showToastNotification("Order prepared! Opening WhatsApp to send to store owner...");

  // Open WhatsApp in new tab
  window.open(encodedUrl, '_blank');
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
