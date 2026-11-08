function showToast(message) {
  if ($("#toast").length === 0) {
    $("body").append('<div id="toast" role="status" aria-live="polite"></div>');
  }
  $("#toast").stop(true, true).text(message).fadeIn(200).delay(2000).fadeOut(300);
}

$(function () {
  $('a[href^="#"]').on("click", function (e) {
    const $target = $(this.hash);
    if (!$target.length) return;
    e.preventDefault();
    $("html, body").stop(true).animate({ scrollTop: $target.offset().top - 70 }, 500);
  });

  $(".faq-q").on("click", function () {
    const $btn = $(this);
    const $answer = $btn.next(".faq-a");
    const isOpen = $btn.attr("aria-expanded") === "true";
    
    $(".faq-q").attr("aria-expanded", "false");
    $(".faq-a").not($answer).stop(true, true).slideUp(200); 
    
    $answer.stop(true, true).slideToggle(200);
    $btn.attr("aria-expanded", String(!isOpen));
  });

  let keyBuffer = "";
  $(document).on("keydown", function(e) {
    keyBuffer += e.key.toLowerCase();
    if (keyBuffer.length > 4) keyBuffer = keyBuffer.substring(1);
    
    if (keyBuffer === "beka") {
        showToast("Beka's Secret Mode Activated!");
        $("body").css("border", "5px solid var(--accent-red)");
        setTimeout(() => $("body").css("border", "none"), 2000);
        keyBuffer = "";
    }
  });
});