/* =========================================================
   فست‌فود آتش — منطق برنامه (script.js)
   ========================================================= */
'use strict';

const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const toFa = (str) => String(str).replace(/\d/g, d => FA_DIGITS[d]);
const toEn = (str) => String(str).replace(/[۰-۹]/g, d => FA_DIGITS.indexOf(d));

function formatPrice(n) {
  const num = Math.round(Number(n) || 0);
  const formatted = num.toLocaleString('en-US').replace(/,/g, '٬');
  return toFa(formatted) + ' تومان';
}

// ============================================================
// ۱. داده‌ها (بدون عکس)
// ============================================================
const PRODUCTS = [
  { id: 'p1', name: 'برگر کلاسیک', desc: 'برگر گوشت تازه، کاهو، گوجه و سس مخصوص', price: 285000, category: 'برگر', badge: 'hot' },
  { id: 'p2', name: 'چیزبرگر دوبل', desc: 'دو لایه گوشت، پنیر چدار و سس مخصوص', price: 395000, category: 'برگر' },
  { id: 'p3', name: 'برگر مخصوص سرآشپز', desc: 'گوشت مخصوص، پنیر گودا، قارچ سوتی و سس ویژه', price: 450000, oldPrice: 520000, category: 'برگر', badge: 'new' },
  { id: 'p4', name: 'چیکن برگر کریسپی', desc: 'فیله مرغ سوخاری، کاهو و سس مایونز', price: 345000, category: 'برگر' },
  { id: 'p5', name: 'پیتزا پپرونی', desc: 'خمیر تازه، پپرونی و پنیر موزارلا', price: 420000, category: 'پیتزا' },
  { id: 'p6', name: 'پیتزا مارگاریتا', desc: 'خمیر ایتالیایی، گوجه، ریحان و پنیر', price: 380000, category: 'پیتزا' },
  { id: 'p7', name: 'فیله سوخاری', desc: 'فیله مرغ ترد و خوشمزه با سیب‌زمینی', price: 365000, category: 'سوخاری', badge: 'hot' },
  { id: 'p8', name: 'هات‌داگ مخصوص', desc: 'سوسیژ گوشت، خیارشور و سس خردل', price: 265000, category: 'ساندویچ' },
  { id: 'p9', name: 'سیب‌زمینی ویژه', desc: 'سیب‌زمینی سرخ‌شده با پنیر و سس مخصوص', price: 185000, category: 'سیب‌زمینی' },
  { id: 'p10', name: 'ناگت مرغ', desc: '۶ عدد ناگت مرغ تازه همراه با سس', price: 165000, category: 'پیش‌غذا' },
  { id: 'p11', name: 'میلک‌شیک شکلاتی', desc: 'شیر، بستنی و شکلات', price: 145000, category: 'نوشیدنی' },
  { id: 'p12', name: 'چیزکیک', desc: 'دسر خامه‌ای با سس توت‌فرنگی', price: 135000, category: 'دسر' }
];

const COMBOS = [
  { id: 'c1', name: 'پکیج دونفره', items: ['۲ برگر دوبل', '۲ سیب‌زمینی', '۲ نوشابه'], price: 890000 },
  { id: 'c2', name: 'پکیج خانوادگی', items: ['۴ برگر کلاسیک', '۲ سیب‌زمینی بزرگ', '۴ نوشابه'], price: 1590000 },
  { id: 'c3', name: 'پکیج مخصوص دوستان', items: ['۲ پیتزا', 'سیب‌زمینی ویژه', '۴ نوشابه'], price: 1290000 }
];

const EXTRAS = [
  { id: 'e1', label: 'پنیر اضافه', price: 20000 },
  { id: 'e2', label: 'سس مخصوص', price: 15000 },
  { id: 'e3', label: 'قارچ', price: 25000 },
  { id: 'e4', label: 'ژامبون', price: 30000 }
];

const DELIVERY_FEE = 50000;
const FREE_DELIVERY_THRESHOLD = 500000;

// ============================================================
// ۲. وضعیت برنامه
// ============================================================
let cart = [];
let activeCategory = 'همه';
let searchQuery = '';
let modalState = { product: null, qty: 1, selectedExtras: new Set(), notes: '' };

// ============================================================
// ۳. توابع کمکی
// ============================================================
function saveCart() {
  localStorage.setItem('atash-cart', JSON.stringify(cart));
}

function loadCart() {
  const saved = localStorage.getItem('atash-cart');
  if (saved) {
    try { cart = JSON.parse(saved) || []; } catch { cart = []; }
  }
}

let toastTimer;
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('is-open');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-open'), 2600);
}

// ============================================================
// ۴. رندر محصولات
// ============================================================
function renderProducts() {
  const grid = document.getElementById('productsGrid');
  const empty = document.getElementById('productsEmpty');
  if (!grid) return;

  let filtered = PRODUCTS;
  if (activeCategory !== 'همه') {
    filtered = filtered.filter(p => p.category === activeCategory);
  }
  if (searchQuery) {
    filtered = filtered.filter(p => p.name.includes(searchQuery) || p.desc.includes(searchQuery));
  }

  if (filtered.length === 0) {
    grid.innerHTML = '';
    if (empty) empty.hidden = false;
    return;
  }
  if (empty) empty.hidden = true;

  grid.innerHTML = filtered.map(p => {
    const hasDiscount = p.oldPrice && p.oldPrice > p.price;
    let badge = '';
    if (p.badge === 'hot') badge = '<span class="product__badge product__badge--hot">پرفروش</span>';
    else if (p.badge === 'new') badge = '<span class="product__badge product__badge--new">جدید</span>';

    return `
      <article class="product">
        <div class="product__media media" onclick="openProductModal('${p.id}')">
          ${badge}
        </div>
        <div class="product__body">
          <h3 class="product__name">${p.name}</h3>
          <p class="product__desc">${p.desc}</p>
          <div class="product__meta">
            <div class="product__price">
              ${hasDiscount ? `<span class="product__price-old">${formatPrice(p.oldPrice)}</span>` : ''}
              <span class="product__price-now">${formatPrice(p.price)}</span>
            </div>
            <button class="product__add" onclick="addToCart('${p.id}')">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

// ============================================================
// ۵. رندر پکیج‌ها
// ============================================================
function renderCombos() {
  const grid = document.getElementById('combosGrid');
  if (!grid) return;

  grid.innerHTML = COMBOS.map(c => `
    <article class="combo">
      <div class="combo__media media"></div>
      <div class="combo__body">
        <h3 class="combo__title">${c.name}</h3>
        <ul class="combo__items">
          ${c.items.map(i => `<li>${i}</li>`).join('')}
        </ul>
        <div class="combo__foot">
          <span class="combo__price">${formatPrice(c.price)}</span>
          <button class="btn btn--primary" onclick="addToCart('${c.id}')">افزودن</button>
        </div>
      </div>
    </article>
  `).join('');
}

// ============================================================
// ۶. سبد خرید
// ============================================================
function addToCart(id, qty = 1, options = [], notes = '', extraPrice = 0) {
  let item;
  const product = PRODUCTS.find(p => p.id === id);
  if (product) item = { ...product, price: product.price + extraPrice };
  else {
    const combo = COMBOS.find(c => c.id === id);
    if (combo) item = { ...combo, category: 'پکیج' };
  }
  if (!item) return;

  const sig = item.id + '|' + [...options].sort().join(',') + '|' + notes.trim();
  const existing = cart.find(i => i.sig === sig);

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      uid: Date.now() + '-' + Math.random().toString(36).slice(2, 6),
      sig: sig,
      id: item.id,
      name: item.name,
      price: item.price,
      qty: qty,
      options: [...options],
      notes: notes.trim()
    });
  }

  saveCart();
  updateCartUI();
  showToast('به سبد اضافه شد ✓');
}

function updateCartUI() {
  const countEl = document.getElementById('cartCount');
  const body = document.getElementById('cartBody');
  const foot = document.getElementById('cartFoot');
  if (!body || !foot) return;

  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);
  if (countEl) countEl.textContent = toFa(totalItems);

  if (cart.length === 0) {
    body.innerHTML = '<div class="cart-empty">سبد خرید شما خالی است</div>';
    foot.innerHTML = '';
    return;
  }

  body.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item__media media"></div>
      <div class="cart-item__info">
        <strong class="cart-item__name">${item.name}</strong>
        ${item.options.length ? `<div class="cart-item__options">${item.options.join(' • ')}</div>` : ''}
        <span class="cart-item__price">${formatPrice(item.price * item.qty)}</span>
        <button class="cart-item__remove" onclick="removeItem('${item.uid}')">حذف</button>
      </div>
      <div class="cart-item__qty">
        <button onclick="changeQty('${item.uid}', -1)">−</button>
        <span>${toFa(item.qty)}</span>
        <button onclick="changeQty('${item.uid}', 1)">+</button>
      </div>
    </div>
  `).join('');

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const delivery = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const total = subtotal + delivery;

  foot.innerHTML = `
    <div class="cart__row"><span>جمع سبد خرید</span><span>${formatPrice(subtotal)}</span></div>
    <div class="cart__row"><span>هزینه ارسال</span><span>${delivery === 0 ? 'رایگان' : formatPrice(delivery)}</span></div>
    <div class="cart__row cart__row--total"><span>مبلغ نهایی</span><span>${formatPrice(total)}</span></div>
    <button class="btn btn--primary cart__checkout" onclick="openCheckout()">تکمیل سفارش</button>
  `;
}

function changeQty(uid, delta) {
  const item = cart.find(i => i.uid === uid);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.uid !== uid);
  }
  saveCart();
  updateCartUI();
}

function removeItem(uid) {
  cart = cart.filter(i => i.uid !== uid);
  saveCart();
  updateCartUI();
}

// ============================================================
// ۷. مودال‌ها و منوها
// ============================================================
function openCart() {
  document.getElementById('cartDrawer').classList.add('is-open');
  document.getElementById('overlay').hidden = false;
  setTimeout(() => document.getElementById('overlay').classList.add('is-open'), 10);
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cartDrawer').classList.remove('is-open');
  document.getElementById('overlay').classList.remove('is-open');
  setTimeout(() => document.getElementById('overlay').hidden = true, 350);
  document.body.style.overflow = '';
}

function openProductModal(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;

  modalState.product = p;
  modalState.qty = 1;
  modalState.selectedExtras = new Set();
  modalState.notes = '';

  renderProductModal();

  const modal = document.getElementById('productModal');
  modal.hidden = false;
  setTimeout(() => modal.classList.add('is-open'), 10);
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  const modal = document.getElementById('productModal');
  modal.classList.remove('is-open');
  setTimeout(() => { modal.hidden = true; }, 350);
  document.body.style.overflow = '';
}

function renderProductModal() {
  const p = modalState.product;
  const content = document.getElementById('pmContent');
  if (!p || !content) return;

  const allowExtras = !['نوشیدنی', 'دسر'].includes(p.category);
  const extrasPrice = [...modalState.selectedExtras].reduce((sum, id) => sum + (EXTRAS.find(e => e.id === id)?.price || 0), 0);
  const total = (p.price + extrasPrice) * modalState.qty;

  content.innerHTML = `
    <div class="pm__media media"></div>
    <div class="pm__body">
      <h2 class="pm__title" id="pmTitle">${p.name}</h2>
      <p class="pm__desc">${p.desc}</p>
      <div class="pm__price">${formatPrice(total)}</div>

      ${allowExtras ? `
        <div class="pm__section">
          <span class="pm__label">افزودنی‌ها (اختیاری)</span>
          <div class="pm__options">
            ${EXTRAS.map(ex => `
              <button type="button" class="pm__opt${modalState.selectedExtras.has(ex.id) ? ' is-selected' : ''}" onclick="toggleExtra('${ex.id}')">
                ${ex.label} (+${formatPrice(ex.price)})
              </button>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <div class="pm__section">
        <span class="pm__label">توضیحات سفارش</span>
        <textarea class="pm__notes" oninput="updateNotes(this.value)" placeholder="مثلاً بدون پیاز، سس بیشتر...">${modalState.notes}</textarea>
      </div>

      <div class="pm__foot">
        <div class="pm__qty">
          <button type="button" onclick="changeModalQty(-1)">−</button>
          <span>${toFa(modalState.qty)}</span>
          <button type="button" onclick="changeModalQty(1)">+</button>
        </div>
        <button class="btn btn--primary" type="button" onclick="submitModalProduct()">افزودن به سبد</button>
      </div>
    </div>
  `;
}

function toggleExtra(id) {
  if (modalState.selectedExtras.has(id)) modalState.selectedExtras.delete(id);
  else modalState.selectedExtras.add(id);
  renderProductModal();
}

function changeModalQty(delta) {
  modalState.qty = Math.max(1, modalState.qty + delta);
  renderProductModal();
}

function updateNotes(val) {
  modalState.notes = val;
}

function submitModalProduct() {
  const p = modalState.product;
  const labels = [...modalState.selectedExtras].map(id => EXTRAS.find(e => e.id === id).label);
  const extrasPrice = [...modalState.selectedExtras].reduce((sum, id) => sum + (EXTRAS.find(e => e.id === id)?.price || 0), 0);
  
  addToCart(p.id, modalState.qty, labels, modalState.notes, extrasPrice);
  closeProductModal();
}

// ============================================================
// ۸. تسویه حساب (Checkout)
// ============================================================
function openCheckout() {
  if (cart.length === 0) {
    showToast('سبد خرید شما خالی است');
    return;
  }
  closeCart();
  renderCheckoutSummary();
  
  const modal = document.getElementById('checkoutModal');
  modal.hidden = false;
  setTimeout(() => modal.classList.add('is-open'), 10);
  document.body.style.overflow = 'hidden';
}

function closeCheckout() {
  const modal = document.getElementById('checkoutModal');
  modal.classList.remove('is-open');
  setTimeout(() => { modal.hidden = true; }, 350);
  document.body.style.overflow = '';
}

function renderCheckoutSummary() {
  const el = document.getElementById('checkoutSummary');
  if (!el) return;
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const delivery = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const total = subtotal + delivery;

  el.innerHTML = `
    <div class="cart__row"><span>تعداد اقلام</span><span>${toFa(cart.reduce((s, i) => s + i.qty, 0))} عدد</span></div>
    <div class="cart__row"><span>جمع سبد خرید</span><span>${formatPrice(subtotal)}</span></div>
    <div class="cart__row"><span>هزینه ارسال</span><span>${delivery === 0 ? 'رایگان' : formatPrice(delivery)}</span></div>
    <div class="cart__row cart__row--total"><span>مبلغ نهایی</span><span>${formatPrice(total)}</span></div>
  `;
}

// اعتبارسنجی فرم
function validateField(id, condition, errorMsg) {
  const input = document.getElementById(id);
  const errorEl = document.querySelector(`[data-error-for="${id}"]`);
  if (!input) return true;

  if (condition) {
    input.classList.remove('is-invalid');
    if (errorEl) errorEl.textContent = '';
    return true;
  } else {
    input.classList.add('is-invalid');
    if (errorEl) errorEl.textContent = errorMsg;
    return false;
  }
}

// ============================================================
// ۹. راه‌اندازی و رویدادها
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  // بارگذاری اولیه
  loadCart();
  renderProducts();
  renderCombos();
  updateCartUI();

  // هدر و اسکرول
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  });

  // سبد خرید
  document.getElementById('cartToggle').addEventListener('click', openCart);
  document.getElementById('cartClose').addEventListener('click', closeCart);
  document.getElementById('overlay').addEventListener('click', () => {
    closeCart();
    closeNav();
  });

  // منوی موبایل
  const nav = document.getElementById('mainNav');
  const menuToggle = document.getElementById('menuToggle');
  window.closeNav = function() {
    nav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    if (!document.getElementById('cartDrawer').classList.contains('is-open')) closeCart();
  };
  menuToggle.addEventListener('click', () => {
    nav.classList.toggle('is-open');
    const isOpen = nav.classList.contains('is-open');
    menuToggle.setAttribute('aria-expanded', isOpen);
    if (isOpen) openCart(); else closeCart();
  });

  // جستجو
  const searchbar = document.getElementById('searchbar');
  document.getElementById('searchToggle').addEventListener('click', () => {
    searchbar.hidden = !searchbar.hidden;
    if (!searchbar.hidden) document.getElementById('searchInput').focus();
  });
  document.getElementById('searchClose').addEventListener('click', () => {
    searchbar.hidden = true;
    document.getElementById('searchInput').value = '';
    searchQuery = '';
    renderProducts();
  });
  document.getElementById('searchInput').addEventListener('input', (e) => {
    searchQuery = e.target.value.trim();
    renderProducts();
  });

  // دسته‌بندی
  document.getElementById('categoriesTrack').addEventListener('click', (e) => {
    const btn = e.target.closest('.cat');
    if (!btn) return;
    document.querySelectorAll('.cat').forEach(c => {
      c.classList.remove('is-active');
      c.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('is-active');
    btn.setAttribute('aria-selected', 'true');
    activeCategory = btn.dataset.cat || 'همه';
    renderProducts();
  });

  // مودال محصول
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      closeProductModal();
      closeCheckout();
    });
  });
  document.getElementById('productModal').addEventListener('click', (e) => {
    if (e.target.id === 'productModal') closeProductModal();
  });
  document.getElementById('checkoutModal').addEventListener('click', (e) => {
    if (e.target.id === 'checkoutModal') closeCheckout();
  });

  // کلید Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProductModal();
      closeCheckout();
      closeCart();
      window.closeNav();
    }
  });

  // فرم تسویه حساب
  const checkoutForm = document.getElementById('checkoutForm');
  checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const isNameValid = validateField('coName', document.getElementById('coName').value.trim().length >= 3, 'نام باید حداقل ۳ کاراکتر باشد');
    const isPhoneValid = validateField('coPhone', /^09\d{9}$/.test(toEn(document.getElementById('coPhone').value).replace(/\s/g, '')), 'شماره موبایل معتبر وارد کنید');
    const isAddressValid = validateField('coAddress', document.getElementById('coAddress').value.trim().length >= 10, 'آدرس باید حداقل ۱۰ کاراکتر باشد');

    if (isNameValid && isPhoneValid && isAddressValid) {
      showToast('سفارش شما با موفقیت ثبت شد! (اتصال به درگاه به‌زودی)');
      closeCheckout();
      cart = [];
      saveCart();
      updateCartUI();
      checkoutForm.reset();
    } else {
      showToast('لطفاً فیلدهای لازم را درست پر کنید');
    }
  });

  // خبرنامه
  const newsletter = document.getElementById('newsletterForm');
  if (newsletter) {
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
  }
});
