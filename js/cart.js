// Reserve list: saved in localStorage as JSON, shown on every page
// (badge + drawer in the navbar) and in the box above the form on the catalog page.
const RESERVE_KEY = "bigfoot-reserve";

function getReserve() {
  try {
    const list = JSON.parse(localStorage.getItem(RESERVE_KEY));
    return Array.isArray(list) ? list : [];   // empty or broken storage -> empty list
  } catch (e) {
    return [];
  }
}

function saveReserve(list) {
  try { localStorage.setItem(RESERVE_KEY, JSON.stringify(list)); } catch (e) { /* storage blocked */ }
  $(document).trigger("reserve:changed");
}

function isReserved(id) {
  return getReserve().some(item => item.id === id);
}

function addToReserve(sneaker) {
  const list = getReserve();
  if (list.some(item => item.id === sneaker.id)) return;
  list.push({ id: sneaker.id, name: sneaker.name, brand: sneaker.brand, price: sneaker.price, image: sneaker.image });
  saveReserve(list);
}

function removeFromReserve(id) {
  saveReserve(getReserve().filter(item => item.id !== id));
}

function clearReserve() {
  saveReserve([]);
}

// calculated value: sum of all prices
function reserveTotal(list) {
  let total = 0;
  for (const item of list) total += item.price;
  return total;
}

function formatPrice(value) {
  return "$" + value.toLocaleString("en-US");
}

function openReserveDrawer() {
  bootstrap.Offcanvas.getOrCreateInstance(document.getElementById("reserveDrawer")).show();
}

// ---------- Drawing ----------
let lastCount = null;

function renderReserve() {
  const list = getReserve();
  const isEmpty = list.length === 0;

  $(".reserve-count").text(list.length);
  $(".reserve-total").text(formatPrice(reserveTotal(list)));
  $(".reserve-empty").prop("hidden", !isEmpty);
  $(".reserve-filled").prop("hidden", isEmpty);

  const $badge = $(".reserve-badge").toggleClass("is-empty", isEmpty);
  if (lastCount !== null && list.length > lastCount) {
    $badge.removeClass("bump");
    setTimeout(() => $badge.addClass("bump"), 10);   // restart the little "pop" animation
  }
  lastCount = list.length;

  const itemsHtml = list.map(item => `
    <li class="reserve-item">
      <img src="${item.image}" alt="" width="56" height="56">
      <div>
        <p class="reserve-item-name">${item.name}</p>
        <p class="reserve-item-meta">${item.brand} · ${formatPrice(item.price)}</p>
      </div>
      <button type="button" class="reserve-remove" data-id="${item.id}" aria-label="Remove ${item.name}">&times;</button>
    </li>`).join("");
  $(".reserve-items").html(itemsHtml);
}

// Every "Reserve" button on the page shows if its pair is already in the list
function syncReserveButtons() {
  const ids = getReserve().map(item => item.id);
  $(".reserve-btn").each(function () {
    const $btn = $(this);
    const name = $btn.data("name");
    const reserved = ids.includes(Number($btn.data("id")));
    $btn.toggleClass("is-reserved", reserved)
      .text(reserved ? "✓ In your list" : "Reserve")
      .attr("aria-label", reserved ? `${name} is in your reserve list. Open the list` : `Reserve ${name}`);
  });
}

$(function () {
  // Reserve button: first click adds the pair, next click opens the list
  $(document).on("click", ".reserve-btn", function () {
    const id = Number($(this).data("id"));

    if (isReserved(id)) {
      openReserveDrawer();
      return;
    }
    const sneaker = typeof sneakers !== "undefined" ? sneakers.find(s => s.id === id) : null;
    if (!sneaker) return;

    addToReserve(sneaker);
    showToast(`Added "${sneaker.name}" to your reserve list`);
  });

  // remove one pair (fade out first)
  $(document).on("click", ".reserve-remove", function () {
    const id = Number($(this).data("id"));
    $(this).prop("disabled", true).closest(".reserve-item").stop(true).fadeOut(200, () => removeFromReserve(id));
  });

  $(document).on("click", ".reserve-clear", function () {
    clearReserve();
    showToast("Reserve list cleared");
  });

  // "Send request" in the drawer: on the catalog page close the drawer and scroll to the form
  $(document).on("click", ".reserve-checkout", function (e) {
    const $form = $("#preorder");
    if (!$form.length) return;          // other page: the normal link opens catalog.html#preorder
    e.preventDefault();
    const drawer = document.getElementById("reserveDrawer");
    drawer.addEventListener("hidden.bs.offcanvas", () => {
      $("html, body").stop(true).animate({ scrollTop: $form.offset().top - 80 }, 500);
    }, { once: true });
    bootstrap.Offcanvas.getOrCreateInstance(drawer).hide();
  });

  $(document).on("reserve:changed", function () {
    renderReserve();
    syncReserveButtons();
  });

  // the list was changed in another tab
  window.addEventListener("storage", e => {
    if (e.key === RESERVE_KEY) $(document).trigger("reserve:changed");
  });

  renderReserve();
  syncReserveButtons();
});