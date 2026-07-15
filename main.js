document.addEventListener("DOMContentLoaded", function () {
  renderProducts(products);
  setupNavigation();
  setupSearch();
  setupFilter();
});

function formatPrice(price) {
  return price.toLocaleString("fa-IR") + " تومان";
}

function renderProducts(list) {
  var container = document.getElementById("products-grid");
  if (!container) return;
  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML =
      '<div class="col-span-full text-center py-20 text-gray-400 text-lg">محصولی یافت نشد</div>';
    return;
  }

  list.forEach(function (product) {
    var card = document.createElement("div");
    card.className =
      "product-card bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-amber-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-2 group";
    card.innerHTML =
      '<div class="relative overflow-hidden">' +
        '<img src="' + product.image + '" alt="' + product.title + '" class="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" onerror="this.src=\'https://via.placeholder.com/600x600/1a1a2e/ffffff?text=' + encodeURIComponent(product.brand) + '\'">' +
        '<div class="absolute top-3 right-3 bg-amber-500 text-black text-xs font-bold px-3 py-1 rounded-full">' + product.brand + '</div>' +
        '<div class="absolute top-3 left-3 bg-gray-800/80 backdrop-blur text-gray-300 text-xs px-3 py-1 rounded-full">' + product.category + '</div>' +
      '</div>' +
      '<div class="p-5">' +
        '<h3 class="text-white font-bold text-lg mb-1 truncate">' + product.title + '</h3>' +
        '<p class="text-gray-400 text-sm mb-3">' + product.brand + ' | ' + product.volume + '</p>' +
        '<div class="flex items-center gap-2 mb-4 text-sm text-gray-500">' +
          '<span class="flex items-center gap-1"><i class="fas fa-clock text-amber-500"></i> ' + product.longevity + '</span>' +
          '<span class="text-gray-700">|</span>' +
          '<span class="flex items-center gap-1"><i class="fas fa-wind text-amber-500"></i> ' + product.sillage + '</span>' +
        '</div>' +
        '<div class="flex items-center justify-between">' +
          '<span class="text-amber-400 font-bold text-xl">' + formatPrice(product.price) + '</span>' +
          '<div class="flex gap-2">' +
            '<button onclick="openDetailModal(\'' + product.id + '\')" class="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-xl text-sm transition-colors duration-300" title="مشاهده جزئیات"><i class="fas fa-eye"></i></button>' +
            '<button onclick="openBuyModal(\'' + product.id + '\')" class="bg-amber-500 hover:bg-amber-400 text-black font-bold px-5 py-2 rounded-xl text-sm transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30">خرید</button>' +
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
        l.classList.remove("text-amber-400");
        l.classList.add("text-gray-300");
      });
      this.classList.remove("text-gray-300");
      this.classList.add("text-amber-400");

      sections.forEach(function (s) {
        s.classList.add("hidden");
      });

      var target = document.querySelector('[data-section="' + page + '"]');
      if (target) {
        target.classList.remove("hidden");
      }

      if (page === "home") {
        var hero = document.getElementById("hero-section");
        if (hero) hero.classList.remove("hidden");
      } else {
        var hero = document.getElementById("hero-section");
        if (hero) hero.classList.add("hidden");
      }

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
          l.classList.remove("text-amber-400");
          l.classList.add("text-gray-300");
          if (l.getAttribute("data-page") === page) {
            l.classList.remove("text-gray-300");
            l.classList.add("text-amber-400");
          }
        });

        sections.forEach(function (s) {
          s.classList.add("hidden");
        });

        var target = document.querySelector('[data-section="' + page + '"]');
        if (target) target.classList.remove("hidden");

        var hero = document.getElementById("hero-section");
        if (page === "home") {
          if (hero) hero.classList.remove("hidden");
        } else {
          if (hero) hero.classList.add("hidden");
        }

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
      if (query === "") {
        renderProducts(products);
        return;
      }
      var filtered = products.filter(function (p) {
        return (
          p.title.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.id.toLowerCase().includes(query)
        );
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
        b.classList.remove("bg-amber-500", "text-black");
        b.classList.add("bg-gray-800", "text-gray-300");
      });
      this.classList.remove("bg-gray-800", "text-gray-300");
      this.classList.add("bg-amber-500", "text-black");

      var filter = this.getAttribute("data-filter");
      if (filter === "all") {
        renderProducts(products);
      } else {
        var filtered = products.filter(function (p) {
          return p.category === filter;
        });
        renderProducts(filtered);
      }
    });
  });
}

function openDetailModal(id) {
  var product = products.find(function (p) {
    return p.id === id;
  });
  if (!product) return;

  var modal = document.getElementById("detail-modal");
  var content = document.getElementById("detail-modal-content");

  content.innerHTML =
    '<div class="relative">' +
      '<button onclick="closeDetailModal()" class="absolute top-4 left-4 z-10 bg-gray-800/80 backdrop-blur text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"><i class="fas fa-times"></i></button>' +
      '<div class="grid md:grid-cols-2 gap-0">' +
        '<div class="relative">' +
          '<img src="' + product.image + '" alt="' + product.title + '" class="w-full h-80 md:h-full object-cover" onerror="this.src=\'https://via.placeholder.com/600x600/1a1a2e/ffffff?text=' + encodeURIComponent(product.brand) + '\'">' +
          '<div class="absolute top-4 right-4 bg-amber-500 text-black text-sm font-bold px-4 py-1 rounded-full">' + product.brand + '</div>' +
        '</div>' +
        '<div class="p-6 md:p-8 overflow-y-auto max-h-[80vh]">' +
          '<div class="mb-4">' +
            '<span class="bg-gray-800 text-gray-300 text-xs px-3 py-1 rounded-full">' + product.category + '</span>' +
            '<span class="bg-gray-800 text-gray-300 text-xs px-3 py-1 rounded-full mr-2">' + product.id + '</span>' +
          '</div>' +
          '<h2 class="text-2xl font-bold text-white mb-2">' + product.title + '</h2>' +
          '<p class="text-amber-400 text-3xl font-bold mb-6">' + formatPrice(product.price) + '</p>' +
          '<p class="text-gray-300 leading-relaxed mb-6">' + product.description + '</p>' +
          '<div class="space-y-3 mb-6">' +
            detailRow("fas fa-flask", "حجم", product.volume) +
            detailRow("fas fa-leaf", "نت‌های بویایی", product.fragranceNotes) +
            detailRow("fas fa-sun", "فصل پیشنهادی", product.season) +
            detailRow("fas fa-clock", "ماندگاری", product.longevity) +
            detailRow("fas fa-wind", "پخش بو", product.sillage) +
          '</div>' +
          '<button onclick="closeDetailModal(); openBuyModal(\'' + product.id + '\')" class="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30 text-lg"><i class="fas fa-shopping-cart ml-2"></i> خرید این محصول</button>' +
        '</div>' +
      '</div>' +
    '</div>';

  modal.classList.remove("hidden");
  modal.classList.add("flex");
  document.body.style.overflow = "hidden";
}

function detailRow(icon, label, value) {
  return (
    '<div class="flex items-start gap-3 bg-gray-800/50 rounded-xl p-3">' +
      '<i class="' + icon + ' text-amber-500 mt-1"></i>' +
      '<div>' +
        '<div class="text-gray-400 text-sm">' + label + '</div>' +
        '<div class="text-white text-sm">' + value + '</div>' +
      '</div>' +
    '</div>'
  );
}

function closeDetailModal() {
  var modal = document.getElementById("detail-modal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
  document.body.style.overflow = "";
}

function openBuyModal(id) {
  var product = products.find(function (p) {
    return p.id === id;
  });
  if (!product) return;

  var modal = document.getElementById("buy-modal");
  var content = document.getElementById("buy-modal-content");

  content.innerHTML =
    '<div class="bg-gray-900 rounded-2xl p-8 max-w-md w-full mx-4 border border-gray-800 relative">' +
      '<button onclick="closeBuyModal()" class="absolute top-4 left-4 text-gray-400 hover:text-white transition-colors"><i class="fas fa-times text-xl"></i></button>' +
      '<div class="text-center">' +
        '<div class="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6"><i class="fas fa-check-circle text-amber-500 text-4xl"></i></div>' +
        '<h3 class="text-white text-xl font-bold mb-4">خرید محصول</h3>' +
        '<div class="bg-gray-800 rounded-xl p-4 mb-6">' +
          '<img src="' + product.image + '" alt="' + product.title + '" class="w-24 h-24 object-cover rounded-xl mx-auto mb-3" onerror="this.src=\'https://via.placeholder.com/100x100/1a1a2e/ffffff?text=' + encodeURIComponent(product.brand) + '\'">' +
          '<p class="text-white font-bold">' + product.title + '</p>' +
          '<p class="text-amber-400 text-sm mt-1">کد محصول: ' + product.id + '</p>' +
          '<p class="text-amber-400 font-bold mt-2">' + formatPrice(product.price) + '</p>' +
        '</div>' +
        '<div class="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6 text-right">' +
          '<p class="text-gray-300 leading-relaxed text-sm">برای تکمیل فرآیند خرید، لطفاً با شماره <strong class="text-amber-400">09058041001</strong> (<strong class="text-white">سید حمید طباطبایی</strong>) تماس بگیرید و کد محصول: <strong class="text-amber-400">' + product.id + '</strong> را به ایشان اعلام کنید.</p>' +
        '</div>' +
        '<a href="tel:09058041001" class="block w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-green-500/30 mb-3"><i class="fas fa-phone-alt ml-2"></i> تماس مستقیم</a>' +
        '<button onclick="closeBuyModal()" class="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 py-3 rounded-xl transition-colors duration-300">بستن</button>' +
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
  if (e.key === "Escape") {
    closeDetailModal();
    closeBuyModal();
  }
});
