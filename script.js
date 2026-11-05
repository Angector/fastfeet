/* =========================================================
   فست‌فود آتش — script.js
   ========================================================= */
'use strict';

/* ============================================================
   1) Persian Helpers (توابع کمکی برای اعداد و قیمت فارسی)
   ============================================================ */
const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';

// تبدیل اعداد انگلیسی به فارسی
const toFa = (str) => String(str).replace(/\d/g, d => FA_DIGITS[d]);

// تبدیل اعداد فارسی به انگلیسی (برای اعتبارسنجی فرم‌ها)
const toEn = (str) => String(str).replace(/[۰-۹]/g, d => FA_DIGITS.indexOf(d));

// فرمت‌دهی قیمت (مثلاً 285000 به "۲۸۵٬۰۰۰ تومان" تبدیل می‌شود)
function formatPrice(n) {
  const num = Math.round(Number(n) || 0);
  const formatted = num.toLocaleString('en-US').replace(/,/g, '٬');
  return toFa(formatted) + ' تومان';
}

/* ============================================================
   2) Data (داده‌های محصولات و پکیج‌ها)
   ============================================================ */
const PRODUCTS = [
  { 
    id: 'classic-burger', 
    name: 'برگر کلاسیک', 
    desc: 'برگر گوشت تازه، کاهو، گوجه و سس مخصوص', 
    price: 285000, 
    category: 'برگر', 
    image: 'images/products/classic-burger.webp', 
    badge: 'hot', 
    rating: 4.8 
  },
  { 
    id: 'double-cheese', 
    name: 'چیزبرگر دوبل', 
    desc: 'دو لایه گوشت، پنیر چدار و سس مخصوص', 
    price: 395000, 
    category: 'برگر', 
    image: 'images/products/double-cheeseburger.webp', 
    rating: 4.9 
  },
  { 
    id: 'chef-burger', 
    name: 'برگر مخصوص سرآشپز', 
    desc: 'گوشت مخصوص، پنیر گودا، قارچ سوتی و سس ویژه', 
    price: 450000, 
    oldPrice: 520000, 
    category: 'برگر', 
    image: 'images/products/chef-burger.webp', 
    badge: 'new', 
    rating: 5 
  },
  { 
    id: 'crispy-chicken', 
    name: 'چیکن برگر کریسپی', 
    desc: 'فیله مرغ سوخاری، کاهو و سس مایونز', 
    price: 345000, 
    category: 'برگر', 
    image: 'images/products/crispy-chicken.webp', 
    rating: 4.7 
  },
  { 
    id: 'pepperoni-pizza', 
    name: 'پیتزا پپرونی', 
    desc: 'خمیر تازه، پپرونی و پنیر موزارلا', 
    price: 420000, 
    category: 'پیتزا', 
    image: 'images/products/pepperoni-pizza.webp', 
    rating: 4.8 
  },
  { 
    id: 'margherita-pizza', 
    name: 'پیتزا مارگاریتا', 
    desc: 'خمیر ایتالیایی، گوجه، ریحان و پنیر', 
    price: 380000, 
    category: 'پیتزا', 
    image: 'images/products/margherita-pizza.webp', 
    rating: 4.6 
  },
  { 
    id: 'chicken-fillet', 
    name: 'فیله سوخاری', 
    desc: 'فیله مرغ ترد و خوشمزه با سیب‌زمینی', 
    price: 365000, 
    category: 'سوخاری', 
    image: 'images/products/chicken-fillet.webp', 
    badge: 'hot', 
    rating: 4.9 
  },
  { 
    id: 'hotdog-special', 
    name: 'هات‌داگ مخصوص', 
    desc: 'سوسیژ گوشت، خیارشور و سس خردل', 
    price: 265000, 
    category: 'ساندویچ', 
    image: 'images/products/hotdog.webp', 
    rating: 4.5 
  },
  { 
    id: 'fries-special', 
    name: 'سیب‌زمینی ویژه', 
    desc: 'سیب‌زمینی سرخ‌شده با پنیر و سس مخصوص', 
    price: 185000, 
    category: 'سیب‌زمینی', 
    image: 'images/products/fries.webp', 
    rating: 4.7 
  },
  { 
    id: 'nuggets', 
    name: 'ناگت مرغ', 
    desc: '۶ عدد ناگت مرغ تازه همراه با سس', 
    price: 165000, 
    category: 'پیش‌غذا', 
    image: 'images/products/nuggets.webp', 
    rating: 4.6 
  },
  { 
    id: 'milkshake', 
    name: 'میلک‌شیک شکلاتی', 
    desc: 'شیر، بستنی و شکلات', 
    price: 145000, 
    category: 'نوشیدنی', 
    image: 'images/products/milkshake.webp', 
    rating: 4.8 
  },
  { 
    id: 'cheesecake', 
    name: 'چیزکیک', 
    desc: 'دسر خامه‌ای با سس توت‌فرنگی', 
    price: 135000, 
    category: 'دسر', 
    image: 'images/products/cheesecake.webp', 
    rating: 4.9 
  }
];

const COMBOS = [
  { 
    id: 'combo-double', 
    name: 'پکیج دونفره', 
    items: ['۲ برگر دوبل', '۲ سیب‌زمینی', '۲ نوشابه'], 
    price: 890000, 
    image: 'images/products/combo-double.webp' 
  },
  { 
    id: 'combo-family', 
    name: 'پکیج خانوادگی', 
    items: ['۴ برگر کلاسیک', '۲ سیب‌زمینی بزرگ', '۴ نوشابه'], 
    price: 1590000, 
    image: 'images/products/combo-family.webp' 
  },
  { 
    id: 'combo-friends', 
    name: 'پکیج مخصوص دوستان', 
    items: ['۲ پیتزا', 'سیب‌زمینی ویژه', '۴ نوشابه'], 
    price: 1290000, 
    image: 'images/products/combo-friends.webp' 
  }
];

const EXTRAS = [
  { id: 'cheese', label: 'پنیر اضافه', price: 20000 },
  { id: 'sauce', label: 'سس مخصوص', price: 15000 },
  { id: 'mushroom', label: 'قارچ', price: 25000 },
  { id: 'bacon', label: 'ژامبون', price: 30000 }
];

const DELIVERY_FEE = 50000;
const FREE_DELIVERY_THRESHOLD = 500000;

/* ============================================================
   3) State (وضعیت متغیرهای برنامه)
   ============================================================ */
let cart = [];
let favorites = new Set();
let activeCategory = 'همه';
let searchQuery = '';

const modalState = {
  product: null,
  qty: 1,
  selectedExtras: new Set(),
  notes: ''
};

/* ============================================================
   4) DOM Refs (اتصال به المان‌های HTML)
   ============================================================ */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

const header          = $('#header');
const nav             = $('#mainNav');
const menuToggle      = $('#menuToggle');
const searchToggle    = $('#searchToggle');
const searchbar       = $('#searchbar');
const searchInput     = $('#searchInput');
const searchClose     = $('#searchClose');
const categoriesTrack = $('#categoriesTrack');
const productsGrid    = $('#productsGrid');
const productsEmpty   = $('#productsEmpty');
const combosGrid      = $('#combosGrid');
const overlay         = $('#overlay');

const cartToggle      = $('#cartToggle');
const cartDrawer      = $('#cartDrawer');
const cartClose       = $('#cartClose');
const cartBody        = $('#cartBody');
const cartFoot        = $('#cartFoot');
const cartCount       = $('#cartCount');

const productModal    = $('#productModal');
const pmContent       = $('#pmContent');
const checkoutModal   = $('#checkoutModal');
const checkoutForm    = $('#checkoutForm');
const checkoutSummary = $('#checkoutSummary');

const toast           = $('#toast');
const newsletter      = $('#newsletterForm');

/* ============================================================
   5) Utility — Toast / Storage / Scroll Lock
   ============================================================ */
let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('is-open');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-open'), 2600);
}

const STORAGE_CART = 'atash-cart';
const STORAGE_FAV  = 'atash-favorites';

function saveCart() {
  try { 
    localStorage.setItem(STORAGE_CART, JSON.stringify(cart)); 
  } catch (e) { 
    console.warn('Could not save cart', e); 
  }
}

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_CART);
    if (raw) cart = JSON.parse(raw) || [];
  } catch { 
    cart = []; 
  }
}

function saveFavorites() {
  try { 
    localStorage.setItem(STORAGE_FAV, JSON.stringify([...favorites])); 
  } catch (e) { 
    console.warn('Could not save favorites', e); 
  }
}

function loadFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_FAV);
    if (raw) favorites = new Set(JSON.parse(raw) || []);
  } catch { 
    favorites = new Set(); 
  }
}

function syncBodyLock() {
  const anyOpen =
    cartDrawer.classList.contains('is-open') ||
    nav.classList.contains('is-open') ||
    !productModal.hidden ||
    !checkoutModal.hidden;
  document.body.style.overflow = anyOpen ? 'hidden' : '';
}

/* ============================================================
   6) Overlay (پرده تاریک پشت منوها)
   ============================================================ */
function showOverlay() {
  overlay.hidden = false;
  requestAnimationFrame(() => overlay.classList.add('is-open'));
}

function hideOverlay() {
  overlay.classList.remove('is-open');
  setTimeout(() => {
    if (!overlay.classList.contains('is-open')) overlay.hidden = true;
  }, 350);
}

overlay.addEventListener('click', () => {
  closeCart();
  closeNav();
});

/* ============================================================
   7) Categories (فیلتر دسته‌بندی)
   ============================================================ */
categoriesTrack.addEventListener('click', (e) => {
  const btn = e.target.closest('.cat');
  if (!btn) return;
  
  // حذف کلاس فعال از همه
  $$('.cat', categoriesTrack).forEach(c => {
    c.classList.remove('is-active');
    c.setAttribute('aria-selected', 'false');
    c.setAttribute('aria-pressed', 'false');
  });
  
  // اضافه کردن به دکمه کلیک شده
  btn.classList.add('is-active');
  btn.setAttribute('aria-selected', 'true');
  btn.setAttribute('aria-pressed', 'true');
  
  activeCategory = btn.dataset.cat || 'همه';
  renderProducts();
});

/* ============================================================
   8) Product Card Render (ساخت کارت محصولات)
   ============================================================ */
function productCardHTML(product, index = 0) {
  const delay = Math.min(index * 60, 600);
  const hasDiscount = product.oldPrice && product.oldPrice > product.price;
  const isFav = favorites.has(product.id);

  let badge = '';
  if (product.badge === 'hot') {
    badge = '<span class="product__badge product__badge--hot">پرفروش</span>';
  } else if (product.badge === 'new') {
    badge = '<span class="product__badge product__badge--new">جدید</span>';
  }

  return `
    <article class="product" data-id="${product.id}" style="animation-delay:${delay}ms">
      <div class="product__media" data-open-modal>
        <figure class="media" data-label="${product.image}">
          <img src="${product.image}" alt="${product.name}" loading="lazy" />
        </figure>
        ${badge}
        <button class="product__fav${isFav ? ' is-active' : ''}" data-fav aria-label="افزودن به علاقه‌مندی" type="button">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
            <path d="M12 21s-7-4.5-9-9c-1.5-3.5 1-7 4.5-7 2 0 3.5 1 4.5 2.5C13 6 14.5 5 16.5 5c3.5 0 6 3.5 4.5 7-2 4.5-9 9-9 9z"/>
          </svg>
        </button>
      </div>
      <div class="product__body">
        <h3 class="product__name">${product.name}</h3>
        <p class="product__desc">${product.desc}</p>
        <div class="product__meta">
          <div class="product__price">
            ${hasDiscount ? `<span class="product__price-old">${formatPrice(product.oldPrice)}</span>` : ''}
            <span class="product__price-now">${formatPrice(product.price)}</span>
          </div>
          <button class="product__add" data-add aria-label="افزودن به سبد" type="button">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          </button>
        </div>
      </div>
    </article>
  `;
}

function renderProducts() {
  let filtered = PRODUCTS;
  
  // فیلتر بر اساس دسته‌بندی
  if (activeCategory !== 'همه') {
    filtered = filtered.filter(p => p.category === activeCategory);
  }
  
  // فیلتر بر اساس جستجو
  if (searchQuery) {
    filtered = filtered.filter(p =>
      p.name.includes(searchQuery) || p.desc.includes(searchQuery)
    );
  }

  if (filtered.length === 0) {
    productsGrid.innerHTML = '';
    productsEmpty.hidden = false;
    return;
  }
  
  productsEmpty.hidden = true;
  productsGrid.innerHTML = filtered.map((p, i) => productCardHTML(p, i)).join('');
  attachImageLoadTracking(productsGrid);
}

/* ============================================================
   9) Products Events (رویدادهای کلیک روی محصولات)
   ============================================================ */
productsGrid.addEventListener('click', (e) => {
  const card = e.target.closest('.product');
  if (!card) return;
  const product = PRODUCTS.find(p => p.id === card.dataset.id);
  if (!product) return;

  // کلیک روی دکمه افزودن به سبد
  if (e.target.closest('[data-add]')) {
    e.stopPropagation();
    addToCart(product, 1);
    return;
  }
  
  // کلیک روی دکمه علاقه‌مندی
  if (e.target.closest('[data-fav]')) {
    e.stopPropagation();
    toggleFavorite(card, product.id);
    return;
  }
  
  // کلیک روی عکس یا نام برای باز شدن مودال
  if (e.target.closest('[data-open-modal]') || e.target.closest('.product__name')) {
    openProductModal(product);
  }
});

function toggleFavorite(card, id) {
  const btn = card.querySelector('[data-fav]');
  const svg = btn.querySelector('svg path');
  const isActive = btn.classList.toggle('is-active');
  
  svg.setAttribute('fill', isActive ? 'currentColor' : 'none');
  
  if (isActive) {
    favorites.add(id);
    showToast('به علاقه‌مندی‌ها اضافه شد ♥');
  } else {
    favorites.delete(id);
    showToast('از علاقه‌مندی‌ها حذف شد');
  }
  saveFavorites();
}

/* ============================================================
   10) Combos Render (ساخت کارت پکیج‌ها)
   ============================================================ */
function comboCardHTML(combo) {
  return `
    <article class="combo" data-combo-id="${combo.id}">
      <div class="combo__media">
        <figure class="media" data-label="${combo.image}">
          <img src="${combo.image}" alt="${combo.name}" loading="lazy" />
        </figure>
      </div>
      <div class="combo__body">
        <h3 class="combo__title">${combo.name}</h3>
        <ul class="combo__items">
          ${combo.items.map(i => `<li>${i}</li>`).join('')}
        </ul>
        <div class="combo__foot">
          <span class="combo__price">${formatPrice(combo.price)}</span>
          <button class="btn btn--primary" data-add-combo>افزودن به سبد</button>
        </div>
      </div>
    </article>
  `;
}

function renderCombos() {
  combosGrid.innerHTML = COMBOS.map(comboCardHTML).join('');
  attachImageLoadTracking(combosGrid);
}

combosGrid.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-add-combo]');
  if (!btn) return;
  const article = btn.closest('.combo');
  const combo = COMBOS.find(c => c.id === article.dataset.comboId);
  if (!combo) return;
  addToCart({ id: combo.id, name: combo.name, price: combo.price, image: combo.image }, 1);
});

/* ============================================================
   11) Cart — Add / Remove / Update (مدیریت سبد خرید)
   ============================================================ */
function addToCart(product, qty = 1, options = [], notes = '', extraPrice = 0) {
  // ساخت یک امضای یکتا برای تشخیص آیتم‌های تکراری با آپشن‌های یکسان
  const sig = product.id + '|' + [...options].sort().join(',') + '|' + notes.trim();
  const existing = cart.find(it => it.sig === sig);
  
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      uid: Date.now() + '-' + Math.random().toString(36).slice(2, 8),
      sig,
      productId: product.id,
      name: product.name,
      image: product.image,
      unitPrice: product.price + extraPrice,
      qty,
      options: [...options],
      notes: notes.trim()
    });
  }
  
  saveCart();
  updateCartUI();
  bumpCartCount();
  showToast('به سبد اضافه شد ✓');
}

function removeFromCart(uid) {
  cart = cart.filter(it => it.uid !== uid);
  saveCart();
  updateCartUI();
  showToast('از سبد حذف شد');
}

function setQty(uid, delta) {
  const item = cart.find(it => it.uid === uid);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(uid);
    return;
  }
  saveCart();
  updateCartUI();
}

function cartTotals() {
  const subtotal = cart.reduce((sum, it) => sum + it.unitPrice * it.qty, 0);
  const delivery = subtotal === 0 ? 0 : (subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE);
  const discount = 0;
  const total = subtotal + delivery - discount;
  return { subtotal, delivery, discount, total };
}

function cartItemCount() {
  return cart.reduce((sum, it) => sum + it.qty, 0);
}

function cartItemHTML(item) {
  const opts = item.options.length
    ? `<div class="cart-item__options">${item.options.join(' • ')}</div>`
    : '';
    
  return `
    <div class="cart-item" data-uid="${item.uid}">
      <div class="cart-item__media">
        <img src="${item.image}" alt="${item.name}" />
      </div>
      <div class="cart-item__info">
        <strong class="cart-item__name">${item.name}</strong>
        ${opts}
        <span class="cart-item__price">${formatPrice(item.unitPrice * item.qty)}</span>
        <button class="cart-item__remove" data-remove type="button">حذف</button>
      </div>
      <div class="cart-item__qty">
        <button data-dec type="button" aria-label="کاهش">−</button>
        <span>${toFa(item.qty)}</span>
        <button data-inc type="button" aria-label="افزایش">+</button>
      </div>
    </div>
  `;
}

function updateCartUI() {
  const count = cartItemCount();
  cartCount.textContent = toFa(count);

  if (cart.length === 0) {
    cartBody.innerHTML = '<div class="cart-empty">سبد خرید شما خالی است</div>';
    cartFoot.innerHTML = '';
    return;
  }

  cartBody.innerHTML = cart.map(cartItemHTML).join('');
  attachImageLoadTracking(cartBody);

  const { subtotal, delivery, discount, total } = cartTotals();
  
  cartFoot.innerHTML = `
    <div class="cart__row"><span>جمع سبد خرید</span><span>${formatPrice(subtotal)}</span></div>
    <div class="cart__row"><span>هزینه ارسال</span><span>${delivery === 0 ? 'رایگان' : formatPrice(delivery)}</span></div>
    ${discount > 0 ? `<div class="cart__row"><span>تخفیف</span><span>-${formatPrice(discount)}</span></div>` : ''}
    <div class="cart__row cart__row--total"><span>مبلغ نهایی</span><span>${formatPrice(total)}</span></div>
    <button class="btn btn--primary cart__checkout" id="cartCheckoutBtn">تکمیل سفارش</button>
  `;

  const checkoutBtn = $('#cartCheckoutBtn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      closeCart();
      openCheckout();
    });
  }
}

cartBody.addEventListener('click', (e) => {
  const item = e.target.closest('.cart-item');
  if (!item) return;
  const uid = item.dataset.uid;
  
  if (e.target.closest('[data-inc]')) {
    setQty(uid, 1);
  } else if (e.target.closest('[data-dec]')) {
    setQty(uid, -1);
  } else if (e.target.closest('[data-remove]')) {
    removeFromCart(uid);
  }
});

function bumpCartCount() {
  cartCount.classList.remove('is-bump');
  void cartCount.offsetWidth; // Trigger reflow
  cartCount.classList.add('is-bump');
}

/* ============================================================
   12) Cart Drawer (باز و بسته کردن سبد خرید)
   ============================================================ */
function openCart() {
  cartDrawer.classList.add('is-open');
  cartDrawer.setAttribute('aria-hidden', 'false');
  showOverlay();
  syncBodyLock();
}

function closeCart() {
  cartDrawer.classList.remove('is-open');
  cartDrawer.setAttribute('aria-hidden', 'true');
  if (!nav.classList.contains('is-open')) hideOverlay();
  syncBodyLock();
}

cartToggle.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);

/* ============================================================
   13) Mobile Nav (منوی موبایل)
   ============================================================ */
function openNav() {
  nav.classList.add('is-open');
  menuToggle.setAttribute('aria-expanded', 'true');
  showOverlay();
  syncBodyLock();
}

function closeNav() {
  nav.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  if (!cartDrawer.classList.contains('is-open')) hideOverlay();
  syncBodyLock();
}

menuToggle.addEventListener('click', () => {
  nav.classList.contains('is-open') ? closeNav() : openNav();
});

nav.addEventListener('click', (e) => {
  if (e.target.matches('.nav__link')) closeNav();
});

/* ============================================================
   14) Search (جستجو)
   ============================================================ */
searchToggle.addEventListener('click', () => {
  searchbar.hidden = !searchbar.hidden;
  searchToggle.setAttribute('aria-expanded', String(!searchbar.hidden));
  if (!searchbar.hidden) searchInput.focus();
});

searchClose.addEventListener('click', () => {
  searchbar.hidden = true;
  searchInput.value = '';
  searchQuery = '';
  searchToggle.setAttribute('aria-expanded', 'false');
  renderProducts();
});

searchInput.addEventListener('input', (e) => {
  searchQuery = e.target.value.trim();
  renderProducts();
});

/* ============================================================
   15) Product Modal (مودال جزئیات محصول)
   ============================================================ */
function openProductModal(product) {
  modalState.product = product;
  modalState.qty = 1;
  modalState.selectedExtras = new Set();
  modalState.notes = '';

  renderProductModal();
  
  productModal.hidden = false;
  requestAnimationFrame(() => productModal.classList.add('is-open'));
  syncBodyLock();
}

function closeProductModal() {
  productModal.classList.remove('is-open');
  setTimeout(() => { 
    if (!productModal.classList.contains('is-open')) productModal.hidden = true; 
  }, 350);
  syncBodyLock();
}

function renderProductModal() {
  const p = modalState.product;
  if (!p) return;
  
  // بررسی اینکه آیا محصول قابلیت افزودنی دارد یا خیر (نوشیدنی و دسر خیر)
  const allowExtras = !['نوشیدنی', 'دسر'].includes(p.category);
  
  // محاسبه قیمت افزودنی‌ها
  const extrasPrice = [...modalState.selectedExtras].reduce((sum, id) => {
    const ex = EXTRAS.find(e => e.id === id);
    return sum + (ex ? ex.price : 0);
  }, 0);
  
  const unitPrice = p.price + extrasPrice;
  const total = unitPrice * modalState.qty;

  pmContent.innerHTML = `
    <div class="pm__media">
      <figure class="media" data-label="${p.image}">
        <img src="${p.image}" alt="${p.name}" />
      </figure>
    </div>
    <div class="pm__body">
      <h2 class="pm__title" id="pmTitle">${p.name}</h2>
      <p class="pm__desc">${p.desc}</p>
      <div class="pm__price" data-price>${formatPrice(total)}</div>

      ${allowExtras ? `
        <div class="pm__section">
          <span class="pm__label">افزودنی‌ها (اختیاری)</span>
          <div class="pm__options" data-extras>
            ${EXTRAS.map(ex => `
              <button type="button" class="pm__opt${modalState.selectedExtras.has(ex.id) ? ' is-selected' : ''}"
                data-extra-id="${ex.id}">
                ${ex.label} (+${formatPrice(ex.price)})
              </button>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <div class="pm__section">
        <span class="pm__label">توضیحات سفارش</span>
        <textarea class="pm__notes" data-notes placeholder="مثلاً بدون پیاز، سس بیشتر...">${modalState.notes}</textarea>
      </div>

      <div class="pm__foot">
        <div class="pm__qty">
          <button type="button" data-dec aria-label="کاهش">−</button>
          <span data-qty>${toFa(modalState.qty)}</span>
          <button type="button" data-inc aria-label="افزایش">+</button>
        </div>
        <button class="btn btn--primary" type="button" data-add-to-cart>افزودن به سبد</button>
      </div>
    </div>
  `;

  attachImageLoadTracking(pmContent);
}

pmContent.addEventListener('click', (e) => {
  // دکمه افزایش تعداد
  if (e.target.closest('[data-inc]')) {
    modalState.qty++;
    renderProductModal();
    return;
  }
  
  // دکمه کاهش تعداد
  if (e.target.closest('[data-dec]')) {
    if (modalState.qty > 1) modalState.qty--;
    renderProductModal();
    return;
  }
  
  // انتخاب افزودنی
  const extraBtn = e.target.closest('[data-extra-id]');
  if (extraBtn) {
    const id = extraBtn.dataset.extraId;
    if (modalState.selectedExtras.has(id)) {
      modalState.selectedExtras.delete(id);
    } else {
      modalState.selectedExtras.add(id);
    }
    renderProductModal();
    return;
  }
  
  // دکمه افزودن به سبد
  if (e.target.closest('[data-add-to-cart]')) {
    const p = modalState.product;
    const extrasArr = [...modalState.selectedExtras];
    const labels = extrasArr.map(id => EXTRAS.find(e => e.id === id).label);
    const extrasPrice = extrasArr.reduce((sum, id) => sum + (EXTRAS.find(e => e.id === id)?.price || 0), 0);
    
    addToCart(p, modalState.qty, labels, modalState.notes, extrasPrice);
    closeProductModal();
  }
});

pmContent.addEventListener('input', (e) => {
  if (e.target.matches('[data-notes]')) {
    modalState.notes = e.target.value;
  }
});

/* ============================================================
   16) Checkout (تکمیل سفارش و اعتبارسنجی)
   ============================================================ */
function openCheckout() {
  if (cart.length === 0) {
    showToast('سبد خرید شما خالی است');
    return;
  }
  renderCheckoutSummary();
  checkoutModal.hidden = false;
  requestAnimationFrame(() => checkoutModal.classList.add('is-open'));
  syncBodyLock();
}

function closeCheckout() {
  checkoutModal.classList.remove('is-open');
  setTimeout(() => { 
    if (!checkoutModal.classList.contains('is-open')) checkoutModal.hidden = true; 
  }, 350);
  syncBodyLock();
}

function renderCheckoutSummary() {
  const { subtotal, delivery, discount, total } = cartTotals();
  const count = cartItemCount();
  
  checkoutSummary.innerHTML = `
    <div class="cart__row"><span>تعداد اقلام</span><span>${toFa(count)} عدد</span></div>
    <div class="cart__row"><span>جمع سبد خرید</span><span>${formatPrice(subtotal)}</span></div>
    <div class="cart__row"><span>هزینه ارسال</span><span>${delivery === 0 ? 'رایگان' : formatPrice(delivery)}</span></div>
    ${discount > 0 ? `<div class="cart__row"><span>تخفیف</span><span>-${formatPrice(discount)}</span></div>` : ''}
    <div class="cart__row cart__row--total"><span>مبلغ نهایی</span><span>${formatPrice(total)}</span></div>
  `;
}

// توابع اعتبارسنجی فرم
const validators = {
  coName: (v) => v.trim().length >= 3 || 'نام باید حداقل ۳ کاراکتر باشد',
  coPhone: (v) => /^09\d{9}$/.test(toEn(v).replace(/\s/g, '')) || 'شماره موبایل معتبر وارد کنید (۰۹...)',
  coAddress: (v) => v.trim().length >= 10 || 'آدرس باید حداقل ۱۰ کاراکتر باشد'
};

function validateField(input) {
  const id = input.id;
  const fn = validators[id];
  if (!fn) return true;
  
  const result = fn(input.value);
  const errorEl = document.querySelector(`[data-error-for="${id}"]`);
  
  if (result === true) {
    input.classList.remove('is-invalid');
    if (errorEl) errorEl.textContent = '';
    return true;
  }
  
  input.classList.add('is-invalid');
  if (errorEl) errorEl.textContent = result;
  return false;
}

checkoutForm.addEventListener('input', (e) => {
  if (validators[e.target.id]) validateField(e.target);
});

checkoutForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const requiredIds = ['coName', 'coPhone', 'coAddress'];
  const valid = requiredIds.map(id => {
    const input = document.getElementById(id);
    return validateField(input);
  }).every(Boolean);

  if (!valid) {
    showToast('لطفاً فیلدهای لازم را درست پر کنید');
    return;
  }

  // اینجا محل اتصال به درگاه پرداخت یا بک‌اند است
  showToast('اطلاعات معتبر است. اتصال به درگاه پرداخت به‌زودی فعال می‌شود.');
});

/* ============================================================
   17) Modal Close (بستن مودال‌ها)
   ============================================================ */
document.addEventListener('click', (e) => {
  if (e.target.closest('[data-close-modal]')) {
    closeProductModal();
    closeCheckout();
  }
});

[productModal, checkoutModal].forEach(m => {
  m.addEventListener('click', (e) => {
    if (e.target === m) {
      if (m === productModal) closeProductModal();
      if (m === checkoutModal) closeCheckout();
    }
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeProductModal();
    closeCheckout();
    closeCart();
    closeNav();
  }
});

/* ============================================================
   18) Newsletter (فرم خبرنامه)
   ============================================================ */
newsletter.addEventListener('submit', (e) => {
  e.preventDefault();
  const input = newsletter.querySelector('input');
  
  if (!input.value.includes('@')) {
    showToast('ایمیل معتبر وارد کنید');
    return;
  }
  
  input.value = '';
  showToast('عضویت شما در خبرنامه ثبت شد ✓');
});

/* ============================================================
   19) Header Scroll Effect (افکت اسکرول هدر)
   ============================================================ */
function setupHeaderScroll() {
  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ============================================================
   20) Reveal on Scroll (انیمیشن ظاهر شدن المان‌ها)
   ============================================================ */
function setupReveal() {
  if (!('IntersectionObserver' in window)) return;
  
  const els = $$('.section__head, .feature, .review, .step, .about__inner > *, .offer-banner');
  els.forEach(el => el.classList.add('reveal'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => io.observe(el));
}

/* ============================================================
   21) Image Load Tracking (مدیریت لود تصاویر و پلیس‌هولدرها)
   ============================================================ */
function attachImageLoadTracking(scope = document) {
  $$('img', scope).forEach(img => {
    const media = img.closest('.media');
    if (!media) return;

    // اگر عکس از قبل لود شده بود (کش)
    if (img.complete && img.naturalWidth > 0) {
      media.classList.add('has-image');
    } 
    // اگر عکس خراب بود (404)
    else if (img.complete && img.naturalWidth === 0) {
      img.style.display = 'none'; 
    } 
    // در حال لود شدن
    else {
      img.addEventListener('load', () => media.classList.add('has-image'), { once: true });
      img.addEventListener('error', () => { img.style.display = 'none'; }, { once: true });
    }
  });
}

/* ============================================================
   22) Init (راه‌اندازی اولیه برنامه)
   ============================================================ */
function init() {
  // اضافه کردن استایل برای مخفی کردن لیبل تصاویر لود شده
  const st = document.createElement('style');
  st.textContent = '.media.has-image::after{display:none!important}';
  document.head.appendChild(st);

  // لود کردن داده‌های ذخیره شده
  loadCart();
  loadFavorites();
  
  // رندر کردن بخش‌های مختلف
  renderProducts();
  renderCombos();
  updateCartUI();
  
  // راه‌اندازی افکت‌ها
  setupHeaderScroll();
  setupReveal();
  attachImageLoadTracking(document);
}

// اجرای برنامه پس از لود کامل DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
