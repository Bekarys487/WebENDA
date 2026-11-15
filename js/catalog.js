<<<<<<< HEAD
$(function () {
  const FALLBACK_IMG = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80";

  let cart = [];
=======
// Catalog: cards built from the `sneakers` array, with search, category filter and price sort.
$(function () {
  if (!$("#sneakerGrid").length) return;

  const FALLBACK_IMG = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80";
  const CATEGORY_TAGS = {
    daily: { label: "Daily", css: "" },
    performance: { label: "Performance", css: " tag--hot" },
    rare: { label: "Rare grail", css: " tag--rare" }
  };

>>>>>>> save-work
  let currentCategory = "all";
  let searchQuery = "";
  let currentSort = "default";

<<<<<<< HEAD
  // ---------- Render catalog ----------
=======
  // ---------- Render ----------
>>>>>>> save-work
  function renderSneakers(items) {
    const $grid = $("#sneakerGrid").empty();
    const $emptyState = $("#emptyState");

<<<<<<< HEAD
    if (items.length === 0) {
      $emptyState.removeAttr("hidden");
      $("#resultCount").text("Showing 0 pairs");
      return;
    }
    $emptyState.attr("hidden", true);
    $("#resultCount").text(`Showing ${items.length} ${items.length === 1 ? "pair" : "pairs"}`);

    items.forEach(sneaker => {
      $grid.append(`
        <div class="card bg-black text-white border border-secondary sneaker-card h-100">
          <img src="${sneaker.image}" class="card-img-top product-img" alt="${sneaker.name}"
               onerror="this.onerror=null;this.src='${FALLBACK_IMG}'">
          <div class="card-body d-flex flex-column">
            <span class="badge bg-secondary text-uppercase align-self-start mb-2">${sneaker.brand}</span>
            <h3 class="h5 card-title text-white text-uppercase fw-bold">${sneaker.name}</h3>
            <p class="card-text text-light opacity-75 small flex-grow-1">${sneaker.desc}</p>
            <div class="d-flex justify-content-between align-items-center mt-3">
              <span class="fs-5 fw-bold text-danger">$${sneaker.price}</span>
              <button type="button" class="btn btn-sm btn-outline-light text-uppercase fw-bold reserve-btn"
                      data-id="${sneaker.id}" aria-label="Reserve ${sneaker.name}">Reserve</button>
            </div>
          </div>
        </div>`);
    });
=======
    $("#resultCount").text(`Showing ${items.length} of ${sneakers.length} ${sneakers.length === 1 ? "pair" : "pairs"}`);

    if (items.length === 0) {
      $emptyState.removeAttr("hidden");
      return;
    }
    $emptyState.attr("hidden", true);

    items.forEach(sneaker => {
      const tag = CATEGORY_TAGS[sneaker.category] || CATEGORY_TAGS.daily;
      $grid.append(`
        <article class="sneaker-card">
          <div class="sneaker-media">
            <img src="${sneaker.image}" alt="${sneaker.name} by ${sneaker.brand}" loading="lazy"
                 onerror="this.onerror=null;this.src='${FALLBACK_IMG}'">
            <span class="tag${tag.css}">${tag.label}</span>
          </div>
          <div class="sneaker-body">
            <p class="sneaker-brand">${sneaker.brand}</p>
            <h3 class="sneaker-name">${sneaker.name}</h3>
            <p class="sneaker-desc">${sneaker.desc}</p>
            <div class="sneaker-foot">
              <span class="sneaker-price">${formatPrice(sneaker.price)}</span>
              <button type="button" class="reserve-btn" data-id="${sneaker.id}" data-name="${sneaker.name}">Reserve</button>
            </div>
          </div>
        </article>`);
    });

    $grid.stop(true, true).hide().fadeIn(250);
    syncReserveButtons();   // from cart.js: show "In your list" on pairs already reserved
>>>>>>> save-work
  }

  // ---------- Filter, search, sort ----------
  function filterAndSort() {
<<<<<<< HEAD
    if (typeof sneakers === "undefined") return;

=======
>>>>>>> save-work
    const result = sneakers.filter(s => {
      const matchesCategory = currentCategory === "all" || s.category === currentCategory;
      const haystack = `${s.name} ${s.brand} ${s.desc} ${s.category}`.toLowerCase();
      return matchesCategory && haystack.includes(searchQuery);
    });

    if (currentSort === "asc") result.sort((a, b) => a.price - b.price);
    if (currentSort === "desc") result.sort((a, b) => b.price - a.price);

    renderSneakers(result);
  }

<<<<<<< HEAD
  // ---------- Reserve list (cart) ----------
  function updateCartUI() {
    const $cartList = $("#cartList").empty();
    const $cartEmpty = $("#cartEmpty");
    const $clearBtn = $("#clearCart");

    $("#cartCount").text(cart.length);

    if (cart.length === 0) {
      $cartEmpty.show();
      $clearBtn.attr("hidden", true);
      $("#cartTotal").text("$0");
    } else {
      $cartEmpty.hide();
      $clearBtn.removeAttr("hidden");

      let total = 0;
      cart.forEach((item, index) => {
        total += item.price;
        $cartList.append(`
          <li class="cart-item d-flex justify-content-between align-items-center mb-2">
            <span>${item.name} ($${item.price})</span>
            <button type="button" class="btn btn-sm text-danger remove-item" data-index="${index}"
                    aria-label="Remove ${item.name}">&times;</button>
          </li>`);
      });
      $("#cartTotal").text(`$${total}`);
    }
    $(document).trigger("cart:changed");
  }

  // used by form.js
  window.getCartCount = () => cart.length;
  window.clearCart = function () {
    cart = [];
    updateCartUI();
  };

=======
  function setActiveChip(category) {
    $(".filter-btn").each(function () {
      const active = $(this).data("category") === category;
      $(this).toggleClass("is-active", active).attr("aria-pressed", String(active));
    });
  }

>>>>>>> save-work
  // ---------- Events ----------
  $("#searchInput").on("input", function () {
    searchQuery = $(this).val().toLowerCase().trim();
    filterAndSort();
  });

  $(".filter-btn").on("click", function () {
<<<<<<< HEAD
    $(".filter-btn").removeClass("btn-danger").addClass("btn-outline-secondary text-white").attr("aria-pressed", "false");
    $(this).removeClass("btn-outline-secondary text-white").addClass("btn-danger").attr("aria-pressed", "true");
    currentCategory = $(this).data("category");
=======
    currentCategory = $(this).data("category");
    setActiveChip(currentCategory);
>>>>>>> save-work
    filterAndSort();
  });

  $("#sortSelect").on("change", function () {
    currentSort = $(this).val();
    filterAndSort();
  });

  $("#resetFilters").on("click", function () {
    $("#searchInput").val("");
<<<<<<< HEAD
    searchQuery = "";
    currentCategory = "all";
    currentSort = "default";
    $("#sortSelect").val("default");
    $(".filter-btn").removeClass("btn-danger").addClass("btn-outline-secondary text-white").attr("aria-pressed", "false");
    $('[data-category="all"]').removeClass("btn-outline-secondary text-white").addClass("btn-danger").attr("aria-pressed", "true");
    filterAndSort();
  });

  $(document).on("click", ".reserve-btn", function () {
    const id = Number($(this).data("id"));
    const sneaker = sneakers.find(s => s.id === id);
    if (!sneaker) return;

    if (cart.some(item => item.id === id)) {
      showToast(`"${sneaker.name}" is already in your reserve list.`);
      return;
    }
    cart.push(sneaker);
    updateCartUI();
    showToast(`Added "${sneaker.name}" to reserve list!`);
  });

  $(document).on("click", ".remove-item", function () {
    cart.splice(Number($(this).data("index")), 1);
    updateCartUI();
  });

  $("#clearCart").on("click", () => window.clearCart());

  // ---------- Init ----------
  if (typeof sneakers !== "undefined") filterAndSort();
  updateCartUI();
=======
    $("#sortSelect").val("default");
    searchQuery = "";
    currentCategory = "all";
    currentSort = "default";
    setActiveChip("all");
    filterAndSort();
  });

  filterAndSort();
>>>>>>> save-work
});