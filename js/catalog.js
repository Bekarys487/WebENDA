// Catalog: cards built from the `sneakers` array, with search, category filter and price sort.
$(function () {
  if (!$("#sneakerGrid").length) return;

  const FALLBACK_IMG = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80";
  const CATEGORY_TAGS = {
    daily: { label: "Daily", css: "" },
    performance: { label: "Performance", css: " tag--hot" },
    rare: { label: "Rare grail", css: " tag--rare" }
  };

  let currentCategory = "all";
  let searchQuery = "";
  let currentSort = "default";

  // ---------- Render ----------
  function renderSneakers(items) {
    const $grid = $("#sneakerGrid").empty();
    const $emptyState = $("#emptyState");

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
  }

  // ---------- Filter, search, sort ----------
  function filterAndSort() {
    const result = sneakers.filter(s => {
      const matchesCategory = currentCategory === "all" || s.category === currentCategory;
      const haystack = `${s.name} ${s.brand} ${s.desc} ${s.category}`.toLowerCase();
      return matchesCategory && haystack.includes(searchQuery);
    });

    if (currentSort === "asc") result.sort((a, b) => a.price - b.price);
    if (currentSort === "desc") result.sort((a, b) => b.price - a.price);

    renderSneakers(result);
  }

  function setActiveChip(category) {
    $(".filter-btn").each(function () {
      const active = $(this).data("category") === category;
      $(this).toggleClass("is-active", active).attr("aria-pressed", String(active));
    });
  }

  // ---------- Events ----------
  $("#searchInput").on("input", function () {
    searchQuery = $(this).val().toLowerCase().trim();
    filterAndSort();
  });

  $(".filter-btn").on("click", function () {
    currentCategory = $(this).data("category");
    setActiveChip(currentCategory);
    filterAndSort();
  });

  $("#sortSelect").on("change", function () {
    currentSort = $(this).val();
    filterAndSort();
  });

  $("#resetFilters").on("click", function () {
    $("#searchInput").val("");
    $("#sortSelect").val("default");
    searchQuery = "";
    currentCategory = "all";
    currentSort = "default";
    setActiveChip("all");
    filterAndSort();
  });

  filterAndSort();
});