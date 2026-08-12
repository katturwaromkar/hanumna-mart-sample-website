/* ==========================================================================
   SHREE HANUMAN SUPER MARKET - Interactive Super Market AI Chatbot
   Answers product queries, daily prices, shop timings, location, and owner contact.
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
    <!-- Chatbot Window -->
    <div id="chatbotWindow" class="chatbot-window">
      <div class="chatbot-header">
        <div class="chatbot-header-info">
          <div class="chatbot-avatar">SH</div>
          <div>
            <div class="chatbot-title">Shree Hanuman Assistant</div>
            <div class="chatbot-status"><span class="status-dot"></span> Open 7 AM - 10 PM | Warje, Pune</div>
          </div>
        </div>
        <button id="chatbotClose" class="chatbot-close-btn">&times;</button>
      </div>

      <div class="chatbot-messages" id="chatbotMessages">
        <div class="chat-msg bot-msg">
          Hello! 👋 Welcome to <strong>Shree Hanuman Super Market</strong>.<br>
          Owner: <strong>Jitendra Bhawarlal unecha</strong><br>
          ⏰ Shop Timing: <strong>7:00 AM – 10:00 PM</strong><br><br>
          I can help you check product rates, store location, timings, or connect with the owner directly.
        </div>
      </div>

      <!-- Quick Suggestion Pills -->
      <div class="chatbot-suggestions" id="chatbotSuggestions">
        <button class="chat-pill" onclick="sendQuickQuery('Today Oil Price')">🛢️ Oil Price</button>
        <button class="chat-pill" onclick="sendQuickQuery('Basmati Rice Rate')">🌾 Rice Rate</button>
        <button class="chat-pill" onclick="sendQuickQuery('Shop Timing')">⏰ Shop Timing</button>
        <button class="chat-pill" onclick="sendQuickQuery('Shop Address Pune')">📍 Address</button>
        <button class="chat-pill" onclick="sendQuickQuery('Contact Owner Jitendra Unecha')">📞 Contact Owner</button>
      </div>

      <form id="chatbotForm" class="chatbot-input-area">
        <input type="text" id="chatInput" placeholder="Ask about products, prices, timings, or location..." autocomplete="off">
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
  const chatWindow = document.getElementById('chatbotWindow');
  const closeBtn = document.getElementById('chatbotClose');

  const toggleChat = () => {
    if (chatWindow) {
      chatWindow.classList.toggle('active');
    }
  };

  closeBtn?.addEventListener('click', toggleChat);

  // Bind external floating column button trigger
  const extTrigger = document.getElementById('floatingBotTriggerBtn');
  if (extTrigger) {
    extTrigger.addEventListener('click', toggleChat);
  }

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

  if (q.includes('timing') || q.includes('time') || q.includes('open') || q.includes('hours') || q.includes('close')) {
    addBotMessage(`<strong>⏰ Shop Timings:</strong><br><br><strong>Shree Hanuman Super Market</strong> is open daily:<br>🗓️ <strong>7:00 AM – 10:00 PM</strong> (All 7 days a week)`);
    return;
  }

  if (q.includes('oil') || q.includes('mustard') || q.includes('sunflower')) {
    const oilProducts = productsData.filter(p => p.category === 'oil');
    let res = `<strong>🛢️ Cooking Oil Rates Today:</strong><br><ul style="margin-top:0.5rem; padding-left:1rem;">`;
    oilProducts.forEach(p => {
      res += `<li style="margin-bottom:0.4rem;"><strong>${p.name}</strong> (${p.weight}): <span style="color:var(--primary-color); font-weight:bold;">₹${p.price}</span> / ${p.unit}</li>`;
    });
    res += `</ul><br><a href="https://wa.me/917083568189?text=Hello%20Jitendra%20Unecha,%20I%20want%20to%20order%20Cooking%20Oil" target="_blank" rel="noopener noreferrer" style="color:var(--primary-color); font-weight:bold; text-decoration:underline;">Click here to Order via WhatsApp</a>`;
    addBotMessage(res);
    return;
  }

  if (q.includes('rice') || q.includes('basmati') || q.includes('sona')) {
    const riceProducts = productsData.filter(p => p.category === 'rice');
    let res = `<strong>🌾 Rice Rates Today:</strong><br><ul style="margin-top:0.5rem; padding-left:1rem;">`;
    riceProducts.forEach(p => {
      res += `<li style="margin-bottom:0.4rem;"><strong>${p.name}</strong> (${p.weight}): <span style="color:var(--primary-color); font-weight:bold;">₹${p.price}</span> / ${p.unit}</li>`;
    });
    res += `</ul><br><a href="https://wa.me/917083568189?text=Hello%20Jitendra%20Unecha,%20I%20want%20to%20order%20Rice" target="_blank" rel="noopener noreferrer" style="color:var(--primary-color); font-weight:bold; text-decoration:underline;">Order Rice on WhatsApp</a>`;
    addBotMessage(res);
    return;
  }

  if (q.includes('sugar') || q.includes('salt') || q.includes('spices') || q.includes('flour') || q.includes('atta') || q.includes('pulses') || q.includes('dal') || q.includes('dry')) {
    const matches = productsData.filter(p => q.includes(p.category) || p.name.toLowerCase().includes(q) || p.categoryLabel.toLowerCase().includes(q));
    if (matches.length > 0) {
      let res = `<strong>📦 Matching Product Rates:</strong><br><ul style="margin-top:0.5rem; padding-left:1rem;">`;
      matches.slice(0, 4).forEach(p => {
        res += `<li style="margin-bottom:0.4rem;"><strong>${p.name}</strong> (${p.weight}): <span style="color:var(--primary-color); font-weight:bold;">₹${p.price}</span> / ${p.unit}</li>`;
      });
      res += `</ul><br>Call <strong>Jitendra Bhawarlal unecha</strong> directly at <a href="tel:7083568189" style="color:var(--primary-color); font-weight:bold;">7083568189</a>.`;
      addBotMessage(res);
      return;
    }
  }

  if (q.includes('address') || q.includes('location') || q.includes('pune') || q.includes('warje') || q.includes('where')) {
    addBotMessage(`<strong>📍 Store Location & Address:</strong><br><br><strong>Shree Hanuman Super Market</strong><br><em>Warje Tapodham Corner, Near Jijai Garden, Pune - 411058</em>.<br><br>⏰ Shop Timings: 7:00 AM to 10:00 PM`);
    return;
  }

  if (q.includes('contact') || q.includes('owner') || q.includes('phone') || q.includes('number') || q.includes('jitendra') || q.includes('email')) {
    addBotMessage(`<strong>📞 Contact Owner Details:</strong><br><br>👤 Owner: <strong>Jitendra Bhawarlal unecha</strong><br>📱 Mobile / WhatsApp: <a href="tel:7083568189" style="color:var(--primary-color); font-weight:bold;">7083568189</a><br>✉️ Email: <a href="mailto:jitendraunecha.ju@gmail.com" style="color:var(--primary-color);">jitendraunecha.ju@gmail.com</a><br>📍 Address: Warje Tapodham Corner, Near Jijai Garden, Pune 411058<br><br><a href="https://wa.me/917083568189?text=Hello%20Jitendra%20Unecha,%20I%20got%20your%20number%20from%20website" target="_blank" rel="noopener noreferrer" style="display:inline-block; padding:0.4rem 0.8rem; background:#25D366; color:#FFF; border-radius:6px; font-weight:bold; margin-top:0.5rem; text-decoration:none;">Open WhatsApp Chat</a>`);
    return;
  }

  // Default fallback matching productsData
  const searchResults = productsData.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
  if (searchResults.length > 0) {
    const item = searchResults[0];
    addBotMessage(`Found product: <strong>${item.name}</strong><br>Brand: ${item.brand}<br>Packaging: ${item.weight}<br>Price: <span style="color:var(--primary-color); font-weight:bold;">₹${item.price}</span> / ${item.unit}<br><br>Call owner <strong>Jitendra Unecha</strong> at <strong>7083568189</strong> to confirm order.`);
  } else {
    addBotMessage(`Thank you for your enquiry! 😊<br><br>For custom product quotes or daily rate updates, please call owner <strong>Jitendra Bhawarlal unecha</strong> directly at <a href="tel:7083568189" style="color:var(--primary-color); font-weight:bold;">7083568189</a> or chat on <a href="https://wa.me/917083568189" target="_blank" rel="noopener noreferrer" style="color:#25D366; font-weight:bold;">WhatsApp</a>.`);
  }
}
