/* ==========================================================================
   SHREE HANUMAN SUPER MARKET - Expanded Daily Essentials Products Dataset
   Includes Vegetables, Wafers/Biscuits, Sugar/Tea, Rice/Wheat, Oils & More
   Owner: Jitendra Bhanwarlal Unecha | Contact: 7083568189
   ========================================================================== */

const productsData = [
  // --- 1. RICE, WHEAT, SUGAR & TEA ESSENTIALS ---
  {
    id: "prod-1",
    name: "Aashirvaad Shuddha Whole Wheat Atta",
    brand: "Aashirvaad",
    category: "sugar_tea",
    categoryLabel: "Sugar, Tea, Wheat & Rice",
    weight: "10kg Bag",
    price: 410,
    unit: "bag",
    availability: "In Stock",
    badge: "Hot Deal",
    featuredHero: true,
    image: "images/wheat_atta.png",
    description: "100% pure wheat grain chakki fresh flour delivering soft, fluffy rotis and high dietary fiber."
  },
  {
    id: "prod-2",
    name: "Madhur Pure Crystal White Sugar",
    brand: "Madhur",
    category: "sugar_tea",
    categoryLabel: "Sugar, Tea, Wheat & Rice",
    weight: "5kg Saver Pack",
    price: 225,
    unit: "pack",
    availability: "In Stock",
    badge: "Sulphur Free",
    featuredHero: true,
    image: "https://images.unsplash.com/photo-1581441363689-1f3c3c414635?auto=format&fit=crop&q=80&w=800",
    description: "Sulphur-free, untouched crystal white sugar refined with modern international standards."
  },
  {
    id: "prod-3",
    name: "Tata Tea Gold Premium Leaf Tea",
    brand: "Tata Tea",
    category: "sugar_tea",
    categoryLabel: "Sugar, Tea, Wheat & Rice",
    weight: "1kg Pack",
    price: 520,
    unit: "pack",
    availability: "In Stock",
    badge: "Rich Aroma",
    featuredHero: true,
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=800",
    description: "Exquisite blend of fine Assam tea leaves with gently rolled long leaves for rich taste."
  },
  {
    id: "prod-4",
    name: "Royal Traditional Basmati Rice",
    brand: "Royal India",
    category: "sugar_tea",
    categoryLabel: "Sugar, Tea, Wheat & Rice",
    weight: "25kg Premium Bag",
    price: 3200,
    unit: "bag",
    availability: "In Stock",
    badge: "Premium Grade",
    featuredHero: true,
    image: "images/basmati_rice.png",
    description: "Aged long-grain aromatic Basmati rice with exquisite fragrance and fluffy post-cooking texture."
  },
  {
    id: "prod-5",
    name: "Sona Masoori Raw Rice 25kg",
    brand: "Hanuman Select",
    category: "sugar_tea",
    categoryLabel: "Sugar, Tea, Wheat & Rice",
    weight: "25kg Wholesale Bag",
    price: 1450,
    unit: "bag",
    availability: "In Stock",
    badge: "Daily Essential",
    image: "images/basmati_rice.png",
    description: "Lightweight, aromatic medium-grain rice perfect for daily household consumption and catering."
  },

  // --- 2. FRESH VEGETABLES & FRUITS ---
  {
    id: "prod-6",
    name: "Fresh Red Onions (Kanda)",
    brand: "Farm Fresh",
    category: "vegetables",
    categoryLabel: "Fresh Vegetables & Fruits",
    weight: "5kg Mesh Bag",
    price: 140,
    unit: "bag",
    availability: "In Stock",
    badge: "Farm Fresh",
    featuredHero: true,
    image: "images/fresh_vegetables.png",
    description: "Crisp, premium quality red onions sourced directly from Junnar and Nashik farms."
  },
  {
    id: "prod-7",
    name: "Fresh Potatoes (Batata)",
    brand: "Farm Fresh",
    category: "vegetables",
    categoryLabel: "Fresh Vegetables & Fruits",
    weight: "5kg Sack",
    price: 130,
    unit: "sack",
    availability: "In Stock",
    badge: "Daily Fresh",
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=800",
    description: "Firm, clean cooking potatoes ideal for fries, curries, and daily sabzi."
  },
  {
    id: "prod-8",
    name: "Ripe Ratta Red Tomatoes",
    brand: "Farm Fresh",
    category: "vegetables",
    categoryLabel: "Fresh Vegetables & Fruits",
    weight: "2kg Basket",
    price: 70,
    unit: "kg",
    availability: "In Stock",
    badge: "Juicy & Fresh",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800",
    description: "Naturally ripened juicy red tomatoes packed with vitamins and rich flavor."
  },
  {
    id: "prod-9",
    name: "Ginger, Garlic & Green Chili Trio",
    brand: "Farm Fresh",
    category: "vegetables",
    categoryLabel: "Fresh Vegetables & Fruits",
    weight: "1kg Combo (400g Ginger + 400g Garlic + 200g Chili)",
    price: 180,
    unit: "pack",
    availability: "In Stock",
    badge: "Essential Trio",
    image: "https://images.unsplash.com/photo-1608797178974-15b35a64ede9?auto=format&fit=crop&q=80&w=800",
    description: "Freshly harvested aromatic ginger, firm white garlic cloves, and spicy green chillies."
  },
  {
    id: "prod-10",
    name: "Fresh Shimla Red Apples",
    brand: "Farm Fresh",
    category: "vegetables",
    categoryLabel: "Fresh Vegetables & Fruits",
    weight: "1kg Box",
    price: 160,
    unit: "kg",
    availability: "In Stock",
    badge: "Sweet & Crunchy",
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&q=80&w=800",
    description: "Juicy, sweet orchard-fresh Shimla red apples rich in antioxidants and fiber."
  },

  // --- 3. WAFERS, BISCUITS & SNACKS ---
  {
    id: "prod-11",
    name: "Classic Potato Salted Wafers & Chips",
    brand: "Haldiram's / Balaji",
    category: "wafers_snacks",
    categoryLabel: "Wafers, Biscuits & Snacks",
    weight: "Pack of 5 (5 x 100g)",
    price: 150,
    unit: "pack",
    availability: "In Stock",
    badge: "Crispy Crunch",
    featuredHero: true,
    image: "images/potato_chips.png",
    description: "Thin, crispy golden potato wafers seasoned with pure rock salt."
  },
  {
    id: "prod-12",
    name: "Britannia Good Day Butter Biscuits",
    brand: "Britannia",
    category: "wafers_snacks",
    categoryLabel: "Wafers, Biscuits & Snacks",
    weight: "600g Super Saver Pack",
    price: 140,
    unit: "pack",
    availability: "In Stock",
    badge: "Tea Time",
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=800",
    description: "Rich buttery cookies loaded with real butter and delightful crunch."
  },
  {
    id: "prod-13",
    name: "Chocolate & Vanilla Cream Wafers",
    brand: "Dukes / Pickwick",
    category: "wafers_snacks",
    categoryLabel: "Wafers, Biscuits & Snacks",
    weight: "300g Twin Pack",
    price: 110,
    unit: "pack",
    availability: "In Stock",
    badge: "Kids Special",
    image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&q=80&w=800",
    description: "Light, crunchy multi-layered wafer rolls filled with smooth chocolate and vanilla cream."
  },
  {
    id: "prod-14",
    name: "Haldiram's Nagpur Ratlami Sev & Bhujia",
    brand: "Haldiram's",
    category: "wafers_snacks",
    categoryLabel: "Wafers, Biscuits & Snacks",
    weight: "400g Pack",
    price: 125,
    unit: "pack",
    availability: "In Stock",
    badge: "Spicy Crunch",
    image: "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&q=80&w=800",
    description: "Authentic spicy chickpea flour fried noodles blended with cloves and black pepper."
  },
  {
    id: "prod-15",
    name: "Maggi 2-Minute Masala Noodles Mega Pack",
    brand: "Nestle Maggi",
    category: "wafers_snacks",
    categoryLabel: "Wafers, Biscuits & Snacks",
    weight: "12 Single Packs Bundle (840g)",
    price: 168,
    unit: "bundle",
    availability: "In Stock",
    badge: "Best Seller",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=800",
    description: "Iconic delicious masala instant noodles fortified with iron for a quick snack."
  },

  // --- 4. COOKING OILS & GHEE ---
  {
    id: "prod-16",
    name: "Fortune Kachi Ghani Mustard Oil",
    brand: "Fortune",
    category: "oil",
    categoryLabel: "Cooking Oil & Ghee",
    weight: "15L Canister / Wholesale Tin",
    price: 1850,
    unit: "tin",
    availability: "In Stock",
    badge: "Best Seller",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=800",
    description: "Cold-pressed pure kachi ghani mustard oil for authentic aroma and high culinary standards."
  },
  {
    id: "prod-17",
    name: "Fortune Refined Sunflower Oil",
    brand: "Fortune",
    category: "oil",
    categoryLabel: "Cooking Oil & Ghee",
    weight: "15L Wholesale Pack (15 x 1L)",
    price: 1680,
    unit: "pack",
    availability: "In Stock",
    badge: "Popular",
    featuredHero: true,
    image: "images/sunflower_oil.png",
    description: "Light and healthy refined sunflower oil rich in Vitamin E, ideal for frying and daily cooking."
  },
  {
    id: "prod-18",
    name: "Amul Pure Cow Ghee",
    brand: "Amul",
    category: "oil",
    categoryLabel: "Cooking Oil & Ghee",
    weight: "1L Tin",
    price: 640,
    unit: "tin",
    availability: "In Stock",
    badge: "Pure Ghee",
    image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&q=80&w=800",
    description: "Traditional Amul cow ghee with granular texture, natural aroma, and rich flavor."
  },

  // --- 5. PULSES & DAL ---
  {
    id: "prod-19",
    name: "Premium Unpolished Toor Dal (Arhar)",
    brand: "Hanuman Select",
    category: "pulses",
    categoryLabel: "Pulses & Dal",
    weight: "5kg Pack",
    price: 690,
    unit: "pack",
    availability: "In Stock",
    badge: "Direct Mill",
    image: "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&q=80&w=800",
    description: "Unpolished, nutrient-dense yellow toor dal free from artificial colors or oil coatings."
  },
  {
    id: "prod-20",
    name: "Pure Moong Dal Washed",
    brand: "Hanuman Select",
    category: "pulses",
    categoryLabel: "Pulses & Dal",
    weight: "2kg Pack",
    price: 240,
    unit: "pack",
    availability: "In Stock",
    badge: "High Protein",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800",
    description: "Easy to digest yellow moong dal, rich in protein and ideal for daily khichdi and soups."
  },

  // --- 6. SPICES & DRY FRUITS ---
  {
    id: "prod-21",
    name: "Everest Pure Turmeric & Chili Powder Combo",
    brand: "Everest",
    category: "spices",
    categoryLabel: "Spices & Masala",
    weight: "1kg Combo Pack (500g Haldi + 500g Mirch)",
    price: 290,
    unit: "pack",
    availability: "In Stock",
    badge: "Best Value",
    featuredHero: true,
    image: "images/spices_combo.png",
    description: "High-curcumin turmeric powder and fiery red chili powder with natural oils preserved."
  },
  {
    id: "prod-22",
    name: "Royal Jumbo Cashews & Almonds Twin Pack",
    brand: "Hanuman Select",
    category: "dryfruits",
    categoryLabel: "Dry Fruits & Nuts",
    weight: "1kg Twin Pack (500g Kaju + 500g Badam)",
    price: 890,
    unit: "pack",
    availability: "In Stock",
    badge: "Premium Grade",
    image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=800",
    description: "Whole W240 jumbo cashews and crunchy California almonds packed in vacuum zip pouches."
  },

  // --- 7. CLEANING & PERSONAL CARE ---
  {
    id: "prod-23",
    name: "Surf Excel Easy Wash Detergent Powder",
    brand: "Surf Excel",
    category: "cleaning",
    categoryLabel: "Cleaning & Household",
    weight: "3kg Pack",
    price: 430,
    unit: "pack",
    availability: "In Stock",
    badge: "Tough Stain Removal",
    image: "https://images.unsplash.com/photo-1585832770485-e68a5fc88240?auto=format&fit=crop&q=80&w=800",
    description: "Superior stain removal power that dissolves fast and cleans clothes effortlessly."
  },
  {
    id: "prod-24",
    name: "Dettol Original Bath Soap Multipack",
    brand: "Dettol",
    category: "personal",
    categoryLabel: "Personal Care",
    weight: "5 x 125g Pack",
    price: 245,
    unit: "pack",
    availability: "In Stock",
    badge: "Germ Protection",
    image: "https://images.unsplash.com/photo-1607006482602-76ca0fd2f9c3?auto=format&fit=crop&q=80&w=800",
    description: "Trusted germ protection soap providing 99.9% protection with fresh pine fragrance."
  }
];

// Load Custom Products from localStorage
const CUSTOM_PRODUCTS_KEY = 'shree_hanuman_custom_products_v1';
try {
  const savedCustomProds = localStorage.getItem(CUSTOM_PRODUCTS_KEY);
  if (savedCustomProds) {
    const parsed = JSON.parse(savedCustomProds);
    if (Array.isArray(parsed)) {
      productsData.push(...parsed);
    }
  }
} catch (e) {
  console.warn("Could not load custom products from localStorage", e);
}

// Function to add new product dynamically
function addNewProductToDataset(prodObj) {
  productsData.unshift(prodObj);

  try {
    const existingCustom = JSON.parse(localStorage.getItem(CUSTOM_PRODUCTS_KEY) || '[]');
    existingCustom.unshift(prodObj);
    localStorage.setItem(CUSTOM_PRODUCTS_KEY, JSON.stringify(existingCustom));
  } catch (e) {
    console.error("Failed to save custom product to localStorage", e);
  }
}

