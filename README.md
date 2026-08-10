# Shree Hanuman Super Market - Premium Super Market Website

A modern, responsive super market and grocery website for **Shree Hanuman Super Market** (Owner: **Jitendra Bhanwarlal Unecha**), built using pure **HTML5**, **CSS3**, and **Vanilla JavaScript**. Designed with luxury Spotify/Apple dark aesthetics, Deep Emerald Green accent (`#0E7A55`), glassmorphism, interactive product search, dynamic price catalog, floating quick actions, interactive AI chatbot, theme switcher, and location map.

---

## 🌟 Key Features

* **Dynamic Price Catalog**: Products rendered directly from `js/products.js`. Prices and stock availability can be updated in seconds.
* **Live Product Search & Filters**: Search items instantly by name, brand, or category (Cooking Oil, Salt, Spices, Rice, Sugar, Wheat Flour, Pulses, Dry Fruits, Grocery Items).
* **WhatsApp & Direct Call Integration**: Pre-filled WhatsApp enquiry message generator targeting owner Jitendra Bhanwarlal Unecha (+91 7083568189).
* **Interactive AI Chatbot**: Instant answers for store timing (7 AM - 10 PM), address, owner contact, and product pricing.
* **Floating Action Buttons**: Fixed bottom-right WhatsApp and Direct Phone Call buttons.
* **100% Static Framework-Free**: Pure HTML, CSS, JavaScript. Upload straight to GitHub & Vercel.

---

## 📁 Directory Structure

```
Shree-Hanuman-Super-Market/
│
├── index.html            # Main semantic HTML5 document
│
├── css/
│   ├── style.css         # Main design system, glassmorphism, components
│   ├── responsive.css    # Responsive breakpoints (desktop, tablet, mobile)
│   └── animations.css    # Pure CSS keyframes & reveal effects
│
├── js/
│   ├── products.js       # Easily editable product data array & price list
│   ├── search.js         # Real-time search engine & category tab handler
│   ├── script.js         # Sticky header, stats counter, carousel, FAQ, form
│   └── chatbot.js        # Interactive AI Chatbot widget
│
└── README.md             # Project documentation & deployment guide
```

---

## ✏️ How to Update Product Prices

To update product pricing, add new products, or change availability:

1. Open `js/products.js`.
2. Locate the product item object you wish to edit:
   ```javascript
   {
     id: "prod-1",
     name: "Fortune Kachi Ghani Mustard Oil",
     brand: "Fortune",
     category: "oil",
     categoryLabel: "Cooking Oil",
     weight: "15L Canister / Wholesale Tin",
     price: 1850, // <-- Edit price here
     unit: "tin",
     availability: "In Stock",
     badge: "Best Seller",
     image: "https://images.unsplash.com/...",
     description: "..."
   }
   ```
3. Save the file and reload the website.

---

## 👤 Store & Owner Information

* **Shop Name**: Shree Hanuman Super Market
* **Owner Name**: Jitendra Bhanwarlal Unecha
* **Shop Address**: Warje Tapodham Corner, Near Jijai Garden, Pune - 411058, Maharashtra
* **Contact Number**: +91 7083568189
* **WhatsApp Number**: +91 7083568189
* **Email ID**: jitendraunecha.ju@gmail.com
* **Shop Timing**: 7:00 AM to 10:00 PM (Daily)
