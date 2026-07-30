# V & B Enterprises - Premium Wholesale Business Website

A modern, responsive wholesale business website for **V & B Enterprises** (Owner: **Basheer Sayed**), built using pure **HTML5**, **CSS3**, and **Vanilla JavaScript**. Designed with luxury Spotify/Apple dark aesthetics, Deep Emerald Green accent (`#0E7A55`), glassmorphism, interactive product search, dynamic price list rendering, floating quick actions, testimonials slider, and FAQ accordion.

---

## 🌟 Key Features

* **Dynamic Wholesale Price Catalog**: Products rendered directly from `js/products.js`. Prices and stock availability can be updated in seconds.
* **Live Product Search & Filters**: Search items instantly by name, brand, or category (Cooking Oil, Salt, Spices, Rice, Sugar, Wheat Flour, Pulses, Dry Fruits, Grocery Items).
* **WhatsApp & Direct Call Integration**: Pre-filled WhatsApp enquiry message generator targeting owner Basheer Sayed.
* **Floating Action Buttons**: Fixed bottom-right WhatsApp and Direct Phone Call buttons.
* **Animated Stat Counters**: Counter transitions for years of trust, products, happy clients, and delivery speeds.
* **Sliding Testimonial Carousel**: Customer review slider with auto-play and touch control.
* **FAQ Accordion**: Smooth collapsible answers for bulk order policies and delivery options.
* **Contact & Enquiry Form**: Validated contact form with direct WhatsApp dispatch option.
* **100% Static Framework-Free**: No React, Vue, Tailwind, or complex build setups required. Upload straight to GitHub & Vercel.

---

## 📁 Directory Structure

```
V-B-Enterprises/
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
│   └── script.js         # Sticky header, stats counter, carousel, FAQ, form
│
└── README.md             # Project documentation & deployment guide
```

---

## ✏️ How to Update Wholesale Prices

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
     price: 1850, // <-- Edit price here (e.g. 1820)
     unit: "tin",
     availability: "In Stock",
     badge: "Best Seller",
     image: "https://images.unsplash.com/...",
     description: "..."
   }
   ```
3. Save the file and reload the website. The live price list updates instantly!

---

## 🚀 How to Deploy on Vercel

1. **Push Code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for V & B Enterprises Wholesale Website"
   git remote add origin https://github.com/YOUR_USERNAME/V-B-Enterprises.git
   git push -u origin main
   ```
2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com) and log in.
   - Click **Add New** -> **Project**.
   - Select your GitHub repository (`V-B-Enterprises`).
   - Leave framework preset as **Other** / **Static HTML**.
   - Click **Deploy**. Your site will be live instantly!

---

## 👤 Owner Information

* **Business Name**: V & B Enterprises
* **Owner**: Basheer Sayed
* **Business Type**: Wholesale Grocery Supplier
* **Phone / WhatsApp**: +91 98765 43210
