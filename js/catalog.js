$(function () {
    let cart = [];

    function renderSneakers(items) {
        const $grid = $("#sneakerGrid").empty();
        const $emptyState = $("#emptyState");
        
        if (items.length === 0) {
            $emptyState.removeAttr("hidden");
            $("#resultCount").text("Showing 0 pairs");
            return;
        }
        $emptyState.attr("hidden", true);
        $("#resultCount").text(`Showing ${items.length} pairs`);

        items.forEach(sneaker => {
            const card = `
                <div class="card bg-black text-white border border-secondary sneaker-card h-100">
                    <img src="${sneaker.image}" class="card-img-top product-img" alt="${sneaker.name}">
                    <div class="card-body d-flex flex-column">
                        <span class="badge bg-secondary text-uppercase align-self-start mb-2">${sneaker.brand}</span>
                        <h3 class="h5 card-title text-white text-uppercase fw-bold">${sneaker.name}</h3>
                        <p class="card-text text-light opacity-75 small flex-grow-1">${sneaker.desc}</p>
                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <span class="fs-5 fw-bold text-danger">$${sneaker.price}</span>
                            <button type="button" class="btn btn-sm btn-outline-light text-uppercase fw-bold reserve-btn" data-id="${sneaker.id}">Reserve</button>
                        </div>
                    </div>
                </div>
            `;
            $grid.append(card);
        });
    }
    
    function updateCartUI() {
        const $cartList = $("#cartList").empty();
        const $cartEmpty = $("#cartEmpty");
        const $clearBtn = $("#clearCart");
        
        $("#cartCount").text(cart.length);

        if (cart.length === 0) {
            $cartEmpty.show();
            $clearBtn.attr("hidden", true);
            $("#cartTotal").text("$0");
            return;
        }

        $cartEmpty.hide();
        $clearBtn.removeAttr("hidden");

        let total = 0; 
        cart.forEach((item, index) => {
            total += item.price;
            $cartList.append(`
                <li class="cart-item d-flex justify-content-between align-items-center mb-2">
                    <span>${item.name} ($${item.price})</span>
                    <button type="button" class="btn btn-sm text-danger remove-item" data-index="${index}">&times;</button>
                </li>
            `);
        });
        $("#cartTotal").text(`$${total}`);
    }

    window.clearCart = function() {
        cart = [];
        updateCartUI();
    };

    if (typeof sneakers !== "undefined") {
        renderSneakers(sneakers);
    }

    let currentCategory = "all";
    let searchQuery = "";
    let currentSort = "default";

    function filterAndSort() {
        if (typeof sneakers === "undefined") return;

        let result = sneakers.filter(s => {
            const matchesCategory = currentCategory === "all" || s.category === currentCategory;
            const matchesSearch = s.name.toLowerCase().includes(searchQuery) || 
                                  s.brand.toLowerCase().includes(searchQuery);
            return matchesCategory && matchesSearch;
        });

        if (currentSort === "asc") {
            result.sort((a, b) => a.price - b.price);
        } else if (currentSort === "desc") {
            result.sort((a, b) => b.price - a.price);
        }

        renderSneakers(result);
    }

    $("#searchInput").on("input", function() {
        searchQuery = $(this).val().toLowerCase().trim();
        filterAndSort();
    });

    $(".filter-btn").on("click", function() {
        $(".filter-btn").removeClass("btn-danger").addClass("btn-outline-secondary text-white").attr("aria-pressed", "false");
        $(this).removeClass("btn-outline-secondary text-white").addClass("btn-danger").attr("aria-pressed", "true");
        currentCategory = $(this).data("category");
        filterAndSort();
    });

    $("#resetFilters").on("click", function() {
        $("#searchInput").val("");
        searchQuery = "";
        currentCategory = "all";
        $(".filter-btn").removeClass("btn-danger").addClass("btn-outline-secondary text-white");
        $('[data-category="all"]').removeClass("btn-outline-secondary text-white").addClass("btn-danger");
        $("#sortSelect").val("default");
        currentSort = "default";
        filterAndSort();
    });

    $("#sortSelect").on("change", function() {
        currentSort = $(this).val();
        filterAndSort();
    });

    $(document).on("click", ".reserve-btn", function() {
        const id = $(this).data("id");
        const sneaker = sneakers.find(s => s.id === id);
        if (sneaker) {
            cart.push(sneaker);
            updateCartUI();
            if (typeof showToast === "function") {
                showToast(`Added "${sneaker.name}" to list!`);
            }
        }
    });

    $(document).on("click", ".remove-item", function() {
        const index = $(this).data("index");
        cart.splice(index, 1);
        updateCartUI();
    });

    $("#clearCart").on("click", function() {
        window.clearCart();
    });
});