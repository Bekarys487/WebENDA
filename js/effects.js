<<<<<<< HEAD
=======
// Small message in the corner. stop() keeps fast repeated calls from piling up.
>>>>>>> save-work
function showToast(message) {
  $("#toast").stop(true, true).text(message).fadeIn(200).delay(2000).fadeOut(300);
}

$(function () {
<<<<<<< HEAD
  // 1. Smooth scroll for same-page anchors
  $('a[href^="#"]').on("click", function (e) {
    const $target = $(this.hash);
    if (!$target.length) return;
    e.preventDefault();
    $("html, body").stop(true).animate({ scrollTop: $target.offset().top - 70 }, 500);
  });

  // 2. FAQ accordion
=======
  // 1. Header stays on top; after scrolling it gets a bottom border
  const $header = $(".site-header");
  $(window).on("scroll", function () {
    $header.toggleClass("is-scrolled", window.scrollY > 10);
  });

  // close the mobile menu after a link is chosen
  $(".navbar-nav .nav-link").on("click", function () {
    const menu = document.getElementById("navbarNav");
    if (menu.classList.contains("show")) bootstrap.Collapse.getOrCreateInstance(menu).hide();
  });

  // 2. Smooth scroll for same-page anchors
  $(document).on("click", 'a[href^="#"]', function (e) {
    const $target = $(this.hash);
    if (!$target.length) return;
    e.preventDefault();
    $("html, body").stop(true).animate({ scrollTop: $target.offset().top - 80 }, 500);
  });

  // 3. FAQ accordion
>>>>>>> save-work
  $(".faq-q").on("click", function () {
    const $btn = $(this);
    const $answer = $btn.next(".faq-a");
    const isOpen = $btn.attr("aria-expanded") === "true";

    $(".faq-q").attr("aria-expanded", "false");
    $(".faq-a").not($answer).stop(true, true).slideUp(200);
    $answer.stop(true, true).slideToggle(200);
    $btn.attr("aria-expanded", String(!isOpen));
  });

<<<<<<< HEAD
  // 3. Easter egg: type "beka" anywhere except inside form fields
=======
  // 4. Easter egg: type "beka" anywhere except inside form fields
>>>>>>> save-work
  let keyBuffer = "";
  $(document).on("keydown", function (e) {
    if ($(e.target).is("input, textarea, select") || e.key.length !== 1) return;

    keyBuffer = (keyBuffer + e.key.toLowerCase()).slice(-4);
    if (keyBuffer !== "beka") return;
    keyBuffer = "";

    showToast("🔥 Beka's Secret Mode Activated!");
    $("body").addClass("secret-mode");
    setTimeout(() => $("body").removeClass("secret-mode"), 2000);

<<<<<<< HEAD
    if (typeof sneakers !== "undefined" && !sneakers.some(s => s.id === 999)) {
=======
    // the secret pair appears only in the catalog
    if (!$("#sneakerGrid").length || typeof sneakers === "undefined") return;
    if (!sneakers.some(s => s.id === 999)) {
>>>>>>> save-work
      sneakers.unshift({
        id: 999, name: "Nike Air Yeezy 2 'Red October'", brand: "Nike", price: 15000, category: "rare",
        image: "https://images.unsplash.com/photo-1608667508764-33cf0726b13a?auto=format&fit=crop&w=600&q=80",
        desc: "THE HOLY GRAIL. 1 of 1. Unlocked directly from Beka's personal vault."
      });
<<<<<<< HEAD
      $("#searchInput").val("Red October").trigger("input");
      $("html, body").animate({ scrollTop: $("#sneakerGrid").offset().top - 100 }, 600);
    }
=======
    }
    $("#searchInput").val("Red October").trigger("input");
    $("html, body").stop(true).animate({ scrollTop: $("#sneakerGrid").offset().top - 100 }, 600);
>>>>>>> save-work
  });
});