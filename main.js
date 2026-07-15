document.addEventListener("DOMContentLoaded", function () {
  renderProducts(products);
  setupNavigation();
  setupSearch();
  setupFilter();
  setupThemeToggle();
});

function isDark() {
  return document.documentElement.classList.contains("dark");
}

function formatPrice(price) {
  return price.toLocaleString("fa-IR") + " تومان";
}

function renderProducts(list) {
  var container = document.getElementById("products-grid");
  if (!container) return;
  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = '<div class="col-span-full text-center py-20 text-gray-400 dark:text-gray-500 text-lg">محصولی یافت نشد</div>';
    return;
  }

  list.forEach(function (product) {
    var card = document.createElement("div");
    card.className = "bg-white dark:bg-gray-800/80 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700/60 card-hover group shadow-sm";
    card.innerHTML =
      '<div class="relative overflow-hidden">' +
        '<img src="' + product.image + '" alt="' + product.title + '" class="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" onerror="this.src=\'https://via.placeholder.com/600x600/f3f4f6/9ca3af?text=' + encodeURIComponent(product.brand) + '\'">' +
        '<div class="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur text-gray-800 dark:text-gray-200 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm border border-gray-100 dark:border-gray-700">' + product.brand + '</div>' +
        '<div class="absolute top-3 left-3 bg-amber-500/90 backdrop-blur text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">' + product.category + '</div>' +
      '</div>' +
      '<div class="p-5">' +
        '<h3 class="text-gray-900 dark:text-white font-bold text-base mb-1 truncate">' + product.title + '</h3>' +
        '<p class="text-gray-400 dark:text-gray-500 text-sm mb-3">' + product.brand + ' | ' + product.volume + '</p>' +
        '<div class="flex items-center gap-2 mb-4 text-xs text-gray-400 dark:text-gray-500">' +
          '<span class="flex items-center gap-1"><i class="fas fa-clock text-amber-500"></i> ' + product.longevity + '</span>' +
          '<span class="text-gray-200 dark:text-gray-700">|</span>' +
          '<span class="flex items-center gap-1"><i class="fas fa-wind text-amber-500"></i> ' + product.sillage + '</span>' +
        '</div>' +
        '<div class="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-gray-700/50">' +
          '<span class="text-gray-900 dark:text-white font-black text-lg">' + formatPrice(product.price) + '</span>' +
          '<div class="flex gap-2">' +
            '<button onclick="openDetailModal(\'' + product.id + '\')" class="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 w-10 h-10 rounded-xl flex items-center justify-center transition-all" title="جزئیات"><i class="fas fa-eye text-sm"></i></button>' +
            '<button onclick="openBuyModal(\'' + product.id + '\')" class="bg-gray-900 dark:bg-amber-500 hover:bg-gray-800 dark:hover:bg-amber-400 text-white dark:text-gray-900 font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md hover:shadow-lg">خرید</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    container.appendChild(card);
  });
}

function setupNavigation() {
  var navLinks = document.querySelectorAll("[data-page]");
  var sections = document.querySelectorAll("[data-section]");

  navLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      var page = this.getAttribute("data-page");

      navLinks.forEach(function (l) {
        l.classList.remove("text-amber-600", "dark:text-amber-400", "bg-amber-50", "dark:bg-amber-500/10", "font-semibold");
        l.classList.add("text-gray-500", "dark:text-gray-400", "font-medium");
      });
      this.classList.remove("text-gray-500", "dark:text-gray-400", "font-medium");
      this.classList.add("text-amber-600", "dark:text-amber-400", "bg-amber-50", "dark:bg-amber-500/10", "font-semibold");

      sections.forEach(function (s) { s.classList.add("hidden"); });
      var target = document.querySelector('[data-section="' + page + '"]');
      if (target) target.classList.remove("hidden");

      var hero = document.getElementById("hero-section");
      if (page === "home") { if (hero) hero.classList.remove("hidden"); }
      else { if (hero) hero.classList.add("hidden"); }

      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  var mobileToggle = document.getElementById("mobile-menu-toggle");
  var mobileMenu = document.getElementById("mobile-menu");
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener("click", function () {
      mobileMenu.classList.toggle("hidden");
    });
    mobileMenu.querySelectorAll("[data-page]").forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        var page = this.getAttribute("data-page");
        mobileMenu.classList.add("hidden");
        navLinks.forEach(function (l) {
          l.classList.remove("text-amber-600", "dark:text-amber-400", "bg-amber-50", "dark:bg-amber-500/10", "font-semibold");
          l.classList.add("text-gray-500", "dark:text-gray-400", "font-medium");
          if (l.getAttribute("data-page") === page) {
            l.classList.remove("text-gray-500", "dark:text-gray-400", "font-medium");
            l.classList.add("text-amber-600", "dark:text-amber-400", "bg-amber-50", "dark:bg-amber-500/10", "font-semibold");
          }
        });
        sections.forEach(function (s) { s.classList.add("hidden"); });
        var target = document.querySelector('[data-section="' + page + '"]');
        if (target) target.classList.remove("hidden");
        var hero = document.getElementById("hero-section");
        if (page === "home") { if (hero) hero.classList.remove("hidden"); }
        else { if (hero) hero.classList.add("hidden"); }
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
  }
}

function setupSearch() {
  var searchInput = document.getElementById("search-input");
  if (!searchInput) return;
  var debounceTimer;
  searchInput.addEventListener("input", function () {
    clearTimeout(debounceTimer);
    var query = this.value.trim().toLowerCase();
    debounceTimer = setTimeout(function () {
      if (query === "") { renderProducts(products); return; }
      var filtered = products.filter(function (p) {
        return p.title.toLowerCase().includes(query) || p.brand.toLowerCase().includes(query) || p.description.toLowerCase().includes(query) || p.id.toLowerCase().includes(query);
      });
      renderProducts(filtered);
    }, 300);
  });
}

function setupFilter() {
  var filterBtns = document.querySelectorAll("[data-filter]");
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) {
        b.classList.remove("bg-gray-900", "dark:bg-amber-500", "text-white", "dark:text-gray-900", "shadow-md");
        b.classList.add("bg-gray-100", "dark:bg-gray-800", "text-gray-600", "dark:text-gray-400");
      });
      this.classList.remove("bg-gray-100", "dark:bg-gray-800", "text-gray-600", "dark:text-gray-400");
      this.classList.add("bg-gray-900", "dark:bg-amber-500", "text-white", "dark:text-gray-900", "shadow-md");

      var filter = this.getAttribute("data-filter");
      if (filter === "all") { renderProducts(products); }
      else {
        var filtered = products.filter(function (p) { return p.category === filter; });
        renderProducts(filtered);
      }
    });
  });
}

function openDetailModal(id) {
  var product = products.find(function (p) { return p.id === id; });
  if (!product) return;

  var modal = document.getElementById("detail-modal");
  var content = document.getElementById("detail-modal-content");

  content.innerHTML =
    '<div class="relative">' +
      '<button onclick="closeDetailModal()" class="absolute top-4 left-4 z-10 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 w-10 h-10 rounded-full flex items-center justify-center transition-colors"><i class="fas fa-times"></i></button>' +
      '<div class="grid md:grid-cols-2 gap-0">' +
        '<div class="relative bg-gray-100 dark:bg-gray-800">' +
          '<img src="' + product.image + '" alt="' + product.title + '" class="w-full h-80 md:h-full object-cover" onerror="this.src=\'https://via.placeholder.com/600x600/f3f4f6/9ca3af?text=' + encodeURIComponent(product.brand) + '\'">' +
          '<div class="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur text-gray-800 dark:text-gray-200 text-sm font-bold px-4 py-1.5 rounded-full shadow-sm border border-gray-100 dark:border-gray-700">' + product.brand + '</div>' +
        '</div>' +
        '<div class="p-6 md:p-8 overflow-y-auto max-h-[80vh]">' +
          '<div class="mb-3 flex gap-2">' +
            '<span class="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs px-3 py-1 rounded-full font-medium">' + product.category + '</span>' +
            '<span class="bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs px-3 py-1 rounded-full font-medium">' + product.id + '</span>' +
          '</div>' +
          '<h2 class="text-xl md:text-2xl font-black text-gray-900 dark:text-white mb-2">' + product.title + '</h2>' +
          '<p class="text-gray-900 dark:text-amber-400 font-black text-2xl mb-5">' + formatPrice(product.price) + '</p>' +
          '<p class="text-gray-600 dark:text-gray-400 leading-relaxed mb-5 text-sm">' + product.description + '</p>' +
          '<div class="space-y-2.5 mb-6">' +
            detailRow("fas fa-flask", "حجم", product.volume) +
            detailRow("fas fa-leaf", "نت‌های بویایی", product.fragranceNotes) +
            detailRow("fas fa-sun", "فصل پیشنهادی", product.season) +
            detailRow("fas fa-clock", "ماندگاری", product.longevity) +
            detailRow("fas fa-wind", "پخش بو", product.sillage) +
          '</div>' +
          '<button onclick="closeDetailModal(); openBuyModal(\'' + product.id + '\')" class="w-full bg-gray-900 dark:bg-amber-500 hover:bg-gray-800 dark:hover:bg-amber-400 text-white dark:text-gray-900 font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl text-sm"><i class="fas fa-shopping-cart ml-2 text-amber-400 dark:text-gray-900"></i> خرید این محصول</button>' +
        '</div>' +
      '</div>' +
    '</div>';

  modal.classList.remove("hidden");
  modal.classList.add("flex");
  document.body.style.overflow = "hidden";
}

function detailRow(icon, label, value) {
  return '<div class="flex items-start gap-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 border border-gray-100 dark:border-gray-700/50">' +
    '<i class="' + icon + ' text-amber-500 mt-0.5"></i>' +
    '<div><div class="text-gray-400 dark:text-gray-500 text-xs">' + label + '</div><div class="text-gray-700 dark:text-gray-300 text-sm font-medium">' + value + '</div></div>' +
  '</div>';
}

function closeDetailModal() {
  var modal = document.getElementById("detail-modal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
  document.body.style.overflow = "";
}

function openBuyModal(id) {
  var product = products.find(function (p) { return p.id === id; });
  if (!product) return;

  var modal = document.getElementById("buy-modal");
  var content = document.getElementById("buy-modal-content");

  content.innerHTML =
    '<div class="bg-white dark:bg-gray-900 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl relative transition-colors">' +
      '<button onclick="closeBuyModal()" class="absolute top-4 left-4 text-gray-300 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"><i class="fas fa-times text-xl"></i></button>' +
      '<div class="text-center">' +
        '<div class="w-16 h-16 bg-green-100 dark:bg-green-500/15 rounded-full flex items-center justify-center mx-auto mb-5"><i class="fas fa-check-circle text-green-600 dark:text-green-400 text-3xl"></i></div>' +
        '<h3 class="text-gray-900 dark:text-white text-xl font-black mb-4">خرید محصول</h3>' +
        '<div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-5 border border-gray-100 dark:border-gray-700">' +
          '<img src="' + product.image + '" alt="' + product.title + '" class="w-20 h-20 object-cover rounded-xl mx-auto mb-3 border border-gray-100 dark:border-gray-700" onerror="this.src=\'https://via.placeholder.com/80x80/f3f4f6/9ca3af?text=' + encodeURIComponent(product.brand) + '\'">' +
          '<p class="text-gray-900 dark:text-white font-bold text-sm">' + product.title + '</p>' +
          '<p class="text-amber-600 dark:text-amber-400 text-xs mt-1 font-medium">کد محصول: ' + product.id + '</p>' +
          '<p class="text-gray-900 dark:text-white font-black mt-2">' + formatPrice(product.price) + '</p>' +
        '</div>' +
        '<div class="bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-xl p-4 mb-5 text-right">' +
          '<p class="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">برای تکمیل فرآیند خرید، لطفاً با شماره <strong class="text-amber-700 dark:text-amber-400">09058041001</strong> (<strong class="text-gray-900 dark:text-white">سید حمید طباطبایی</strong>) تماس بگیرید و کد محصول: <strong class="text-amber-700 dark:text-amber-400">' + product.id + '</strong> را به ایشان اعلام کنید.</p>' +
        '</div>' +
        '<a href="tel:09058041001" class="block w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-green-600/15 mb-3"><i class="fas fa-phone-alt ml-2"></i> تماس مستقیم</a>' +
        '<button onclick="closeBuyModal()" class="w-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 py-3 rounded-xl transition-colors font-medium">بستن</button>' +
      '</div>' +
    '</div>';

  modal.classList.remove("hidden");
  modal.classList.add("flex");
  document.body.style.overflow = "hidden";
}

function closeBuyModal() {
  var modal = document.getElementById("buy-modal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
  document.body.style.overflow = "";
}

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") { closeDetailModal(); closeBuyModal(); }
});

function setupThemeToggle() {
  var toggleBtn = document.getElementById("theme-toggle");
  var toggleBtnMobile = document.getElementById("theme-toggle-mobile");

  function toggleTheme() {
    document.documentElement.classList.toggle("dark");
    var dark = document.documentElement.classList.contains("dark");
    localStorage.setItem("theme", dark ? "dark" : "light");
  }

  if (toggleBtn) toggleBtn.addEventListener("click", toggleTheme);
  if (toggleBtnMobile) toggleBtnMobile.addEventListener("click", toggleTheme);
}
