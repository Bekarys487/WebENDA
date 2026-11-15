// Size guide (modal on every page): table, size finder and the size field of the form.
// Everything is built from the `sizes` array in data.js.
$(function () {
  const SIZE_KEY = "bigfoot-size";
  const $tbody = $("#sizeTableBody");
  const $select = $("#shoeSize");          // exists only on the catalog page
  const modalEl = document.getElementById("sizeModal");

  // ---------- Build the table and the <select> options ----------
  sizes.forEach(size => {
    // badge color depends on the fit group
    let fitClass = "fit-badge--standard";
    if (size.fit === "Bigfoot Entry") fitClass = "fit-badge--entry";
    if (size.fit === "Bigfoot Massive") fitClass = "fit-badge--massive";

    $tbody.append(`
      <tr data-eu="${size.eu}">
        <td>US ${size.us}</td>
        <td class="col-eu">EU ${size.eu}</td>
        <td>UK ${size.uk}</td>
        <td>${size.cm.toFixed(1)} cm</td>
        <td><span class="badge rounded-pill fit-badge ${fitClass}">${size.fit}</span></td>
      </tr>`);
    $select.append(`<option value="${size.eu}">EU ${size.eu} (${size.cm.toFixed(1)} cm)</option>`);
  });

  // remember the chosen size for the next visit
  let savedSize = null;
  try { savedSize = localStorage.getItem(SIZE_KEY); } catch (e) { /* storage blocked */ }
  if (savedSize && $select.find(`option[value="${savedSize}"]`).length) $select.val(savedSize);

  $select.on("change", function () {
    try { localStorage.setItem(SIZE_KEY, $(this).val()); } catch (e) { /* storage blocked */ }
  });

  // ---------- Size finder ----------
  // smallest size whose length is >= the foot length
  function findSize(cm) {
    for (const size of sizes) {
      if (size.cm >= cm) return size;
    }
    return null;
  }

  function showFinderError(message) {
    $("#footLength").toggleClass("is-invalid", message !== "");
    $("#err-footLength").text(message);
  }

  $("#sizeFinder").on("submit", function (e) {
    e.preventDefault();
    const raw = $("#footLength").val().trim().replace(",", ".");
    const cm = Number(raw);
    const $result = $("#sizeResult");

    $tbody.find("tr").removeClass("is-match");

    let error = "";
    if (!raw) error = "Enter your foot length in centimetres.";
    else if (isNaN(cm)) error = "Use numbers only, e.g. 27.5";
    else if (cm < 20 || cm > 36) error = "Foot length should be between 20 and 36 cm.";

    showFinderError(error);
    if (error) {
      $result.prop("hidden", true);
      return;
    }

    const size = findSize(cm);
    if (!size) {
      $result.removeClass("is-warning").addClass("is-warning").prop("hidden", false)
        .html(`<span>${cm} cm is longer than our scale. Pick “Custom Sourcing” in the form and write your size in the notes. We find bigger pairs on request.</span>`);
      return;
    }

    $tbody.find(`tr[data-eu="${size.eu}"]`).addClass("is-match");
    $result.removeClass("is-warning").prop("hidden", false).html(`
      <span>Your size: <strong>EU ${size.eu}</strong> · US ${size.us} · UK ${size.uk} (${size.fit})</span>
      <button type="button" class="btn btn-accent btn-sm-pill use-size" data-eu="${size.eu}">Use EU ${size.eu}</button>`);
  });

  $("#footLength").on("input", function () {
    if ($(this).hasClass("is-invalid")) showFinderError("");
  });

  // "Use EU xx": fill the form (catalog page) or go to the form (other pages)
  $(document).on("click", ".use-size", function () {
    const eu = String($(this).data("eu"));
    try { localStorage.setItem(SIZE_KEY, eu); } catch (e) { /* storage blocked */ }

    if (!$select.length) {
      window.location.href = "catalog.html#preorder";
      return;
    }
    $select.val(eu).trigger("change");
    modalEl.addEventListener("hidden.bs.modal", () => {
      $("html, body").stop(true).animate({ scrollTop: $("#preorder").offset().top - 80 }, 500);
      showToast(`Size EU ${eu} added to the form`);
    }, { once: true });
    bootstrap.Modal.getOrCreateInstance(modalEl).hide();
  });

  // old links like catalog.html#size-guide open the modal
  if (window.location.hash === "#size-guide") bootstrap.Modal.getOrCreateInstance(modalEl).show();
});