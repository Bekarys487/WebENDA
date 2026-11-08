$(function () {
  const FALLBACK_IMG = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80";

  let cart = [];
  let currentCategory = "all";
  let searchQuery = "";
  let currentSort = "default";

  // ---------- Render catalog ----------
  function renderSneakers(items) {
    const $grid = $("#sneakerGrid").empty();
    const $emptyState = $("#emptyState");

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
  }

  // ---------- Filter, search, sort ----------
  function filterAndSort() {
    if (typeof sneakers === "undefined") return;

    const result = sneakers.filter(s => {
      const matchesCategory = currentCategory === "all" || s.category === currentCategory;
      const haystack = `${s.name} ${s.brand} ${s.desc} ${s.category}`.toLowerCase();
      return matchesCategory && haystack.includes(searchQuery);
    });

    if (currentSort === "asc") result.sort((a, b) => a.price - b.price);
    if (currentSort === "desc") result.sort((a, b) => b.price - a.price);

    renderSneakers(result);
  }

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

  // ---------- Events ----------
  $("#searchInput").on("input", function () {
    searchQuery = $(this).val().toLowerCase().trim();
    filterAndSort();
  });

  $(".filter-btn").on("click", function () {
    $(".filter-btn").removeClass("btn-danger").addClass("btn-outline-secondary text-white").attr("aria-pressed", "false");
    $(this).removeClass("btn-outline-secondary text-white").addClass("btn-danger").attr("aria-pressed", "true");
    currentCategory = $(this).data("category");
    filterAndSort();
  });

  $("#sortSelect").on("change", function () {
    currentSort = $(this).val();
    filterAndSort();
  });

  $("#resetFilters").on("click", function () {
    $("#searchInput").val("");
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
});