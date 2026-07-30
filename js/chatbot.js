/* ==========================================================================
   V & B ENTERPRISES - Wholesale Interactive AI Chatbot
   Answers product queries, daily prices, minimum order quantity, delivery, and owner contact.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  createChatbotWidget();
});

function createChatbotWidget() {
  // Create Chatbot Elements
  const chatbotContainer = document.createElement('div');
  chatbotContainer.id = 'wholesaleChatbot';
  chatbotContainer.className = 'chatbot-container';

  chatbotContainer.innerHTML = `
    <!-- Floating Toggle Button -->
    <button id="chatbotToggle" class="chatbot-toggle-btn" aria-label="Open Wholesale Chatbot">
      <div class="chatbot-badge">1</div>
      <svg class="bot-icon-open" width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
      </svg>
      <svg class="bot-icon-close" width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="display:none;">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
      </svg>
    </button>

    <!-- Chatbot Window -->
    <div id="chatbotWindow" class="chatbot-window">
      <div class="chatbot-header">
        <div class="chatbot-header-info">
          <div class="chatbot-avatar">VB</div>
          <div>
            <div class="chatbot-title">V & B Wholesale Bot</div>
            <div class="chatbot-status"><span class="status-dot"></span> Online | Naigaon Bazar</div>
          </div>
        </div>
        <button id="chatbotClose" class="chatbot-close-btn">&times;</button>
      </div>

      <div class="chatbot-messages" id="chatbotMessages">
        <div class="chat-msg bot-msg">
          Hello! 👋 Welcome to <strong>V & B Enterprises</strong> (Owner: <strong>Basheer Sayed</strong>).<br><br>
          I can help you check today's wholesale rates for Rice, Cooking Oil, Spices, Sugar, Flour, Pulses & Dry Fruits. What product are you looking for?
        </div>
      </div>

      <!-- Quick Suggestion Pills -->
      <div class="chatbot-suggestions" id="chatbotSuggestions">
        <button class="chat-pill" onclick="sendQuickQuery('Today Oil Price')">🛢️ Oil Price</button>
        <button class="chat-pill" onclick="sendQuickQuery('Basmati Rice Rate')">🌾 Rice Rate</button>
        <button class="chat-pill" onclick="sendQuickQuery('Minimum Order Quantity')">📦 Min Order</button>
        <button class="chat-pill" onclick="sendQuickQuery('Delivery to Nanded')">🚚 Delivery Info</button>
        <button class="chat-pill" onclick="sendQuickQuery('Contact Owner Basheer Sayed')">📞 Contact Owner</button>
      </div>

      <form id="chatbotForm" class="chatbot-input-area">
        <input type="text" id="chatInput" placeholder="Ask about prices, products, or location..." autocomplete="off">
        <button type="submit" class="chat-send-btn" aria-label="Send message">
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
          </svg>
        </button>
      </form>
    </div>
  `;

  document.body.appendChild(chatbotContainer);

  // Toggle Window Handlers
  const toggleBtn = document.getElementById('chatbotToggle');
  const chatWindow = document.getElementById('chatbotWindow');
  const closeBtn = document.getElementById('chatbotClose');
  const openIcon = toggleBtn.querySelector('.bot-icon-open');
  const closeIcon = toggleBtn.querySelector('.bot-icon-close');
  const badge = toggleBtn.querySelector('.chatbot-badge');

  const toggleChat = () => {
    const isOpen = chatWindow.classList.toggle('active');
    openIcon.style.display = isOpen ? 'none' : 'block';
    closeIcon.style.display = isOpen ? 'block' : 'none';
    if (badge) badge.style.display = 'none';
  };

  toggleBtn.addEventListener('click', toggleChat);
  closeBtn.addEventListener('click', toggleChat);

  // Form Submit Handler
  const form = document.getElementById('chatbotForm');
  const input = document.getElementById('chatInput');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    addUserMessage(text);
    input.value = '';
    setTimeout(() => processBotResponse(text), 400);
  });
}

// Global function for quick pill clicks
window.sendQuickQuery = function(queryText) {
  addUserMessage(queryText);
  setTimeout(() => processBotResponse(queryText), 300);
};

function addUserMessage(text) {
  const container = document.getElementById('chatbotMessages');
  const msg = document.createElement('div');
  msg.className = 'chat-msg user-msg';
  msg.innerText = text;
  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;
}

function addBotMessage(htmlContent) {
  const container = document.getElementById('chatbotMessages');
  const msg = document.createElement('div');
  msg.className = 'chat-msg bot-msg';
  msg.innerHTML = htmlContent;
  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;
}

function processBotResponse(query) {
  const q = query.toLowerCase();

  if (q.includes('oil') || q.includes('mustard') || q.includes('sunflower')) {
    const oilProducts = productsData.filter(p => p.category === 'oil');
    let res = `<strong>🛢️ Wholesale Cooking Oil Rates Today:</strong><br><ul style="margin-top:0.5rem; padding-left:1rem;">`;
    oilProducts.forEach(p => {
      res += `<li style="margin-bottom:0.4rem;"><strong>${p.name}</strong> (${p.weight}): <span style="color:var(--primary-color); font-weight:bold;">₹${p.price}</span> / ${p.unit}</li>`;
    });
    res += `</ul><br><a href="https://wa.me/918411821767?text=Hello%20Basheer%20Sayed,%20I%20want%20to%20order%20Cooking%20Oil" target="_blank" style="color:var(--primary-color); font-weight:bold; text-decoration:underline;">Click here to Order via WhatsApp</a>`;
    addBotMessage(res);
    return;
  }

  if (q.includes('rice') || q.includes('basmati') || q.includes('sona')) {
    const riceProducts = productsData.filter(p => p.category === 'rice');
    let res = `<strong>🌾 Wholesale Rice Rates Today:</strong><br><ul style="margin-top:0.5rem; padding-left:1rem;">`;
    riceProducts.forEach(p => {
      res += `<li style="margin-bottom:0.4rem;"><strong>${p.name}</strong> (${p.weight}): <span style="color:var(--primary-color); font-weight:bold;">₹${p.price}</span> / ${p.unit}</li>`;
    });
    res += `</ul><br><a href="https://wa.me/918411821767?text=Hello%20Basheer%20Sayed,%20I%20want%20to%20order%20Rice" target="_blank" style="color:var(--primary-color); font-weight:bold; text-decoration:underline;">Order Rice on WhatsApp</a>`;
    addBotMessage(res);
    return;
  }

  if (q.includes('sugar') || q.includes('salt') || q.includes('spices') || q.includes('flour') || q.includes('atta') || q.includes('pulses') || q.includes('dal') || q.includes('dry')) {
    const matches = productsData.filter(p => q.includes(p.category) || p.name.toLowerCase().includes(q) || p.categoryLabel.toLowerCase().includes(q));
    if (matches.length > 0) {
      let res = `<strong>📦 Matching Wholesale Rates:</strong><br><ul style="margin-top:0.5rem; padding-left:1rem;">`;
      matches.slice(0, 4).forEach(p => {
        res += `<li style="margin-bottom:0.4rem;"><strong>${p.name}</strong> (${p.weight}): <span style="color:var(--primary-color); font-weight:bold;">₹${p.price}</span> / ${p.unit}</li>`;
      });
      res += `</ul><br>Call <strong>Basheer Sayed</strong> directly at <a href="tel:8411821767" style="color:var(--primary-color); font-weight:bold;">8411821767</a> for daily custom quotes.`;
      addBotMessage(res);
      return;
    }
  }

  if (q.includes('min') || q.includes('minimum') || q.includes('quantity') || q.includes('order')) {
    addBotMessage(`<strong>📦 Minimum Order Quantities:</strong><br><br>We supply wholesale quantities starting from 1 full bag/tin/crate up to multi-ton truckloads.<br><br>For retail shopkeepers in Naigaon & Nanded district, doorstep delivery is available!`);
    return;
  }

  if (q.includes('delivery') || q.includes('nanded') || q.includes('address') || q.includes('location') || q.includes('where')) {
    addBotMessage(`<strong>📍 Enterprise Location & Delivery:</strong><br><br><strong>V & B Enterprises</strong> is located at:<br><em>Naigaon Bazar, District Nanded, Maharashtra</em>.<br><br>🚚 We deliver across Nanded district and surrounding commercial markets within 24 hours!`);
    return;
  }

  if (q.includes('contact') || q.includes('owner') || q.includes('phone') || q.includes('number') || q.includes('basheer')) {
    addBotMessage(`<strong>📞 Contact Owner Basheer Sayed:</strong><br><br>📱 Mobile / WhatsApp: <a href="tel:8411821767" style="color:var(--primary-color); font-weight:bold;">8411821767</a><br>📍 Location: Naigaon Bazar, Dist. Nanded, Maharashtra<br><br><a href="https://wa.me/918411821767?text=Hello%20Basheer%20Sayed,%20I%20got%20your%20number%20from%20website" target="_blank" style="display:inline-block; padding:0.4rem 0.8rem; background:#25D366; color:#FFF; border-radius:6px; font-weight:bold; margin-top:0.5rem; text-decoration:none;">Open WhatsApp Chat</a>`);
    return;
  }

  // Default fallback matching productsData
  const searchResults = productsData.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
  if (searchResults.length > 0) {
    const item = searchResults[0];
    addBotMessage(`Found product: <strong>${item.name}</strong><br>Brand: ${item.brand}<br>Packaging: ${item.weight}<br>Price: <span style="color:var(--primary-color); font-weight:bold;">₹${item.price}</span> / ${item.unit}<br><br>Call owner <strong>Basheer Sayed</strong> at <strong>8411821767</strong> to confirm order.`);
  } else {
    addBotMessage(`Thank you for your enquiry! 😊<br><br>For custom product quotes or daily rate updates, please call owner <strong>Basheer Sayed</strong> directly at <a href="tel:8411821767" style="color:var(--primary-color); font-weight:bold;">8411821767</a> or chat on <a href="https://wa.me/918411821767" target="_blank" style="color:#25D366; font-weight:bold;">WhatsApp</a>.`);
  }
}
