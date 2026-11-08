const form = document.getElementById("sneakerForm");

const cartCount = () => (typeof window.getCartCount === "function" ? window.getCartCount() : 0);

const rules = {
  fullName: v =>
    !v ? "Enter your full name."
    : !/^[A-Za-zА-Яа-яЁё\s'-]{2,}$/.test(v) ? "Use letters only, at least 2 characters." : "",

  emailAddr: v =>
    !v ? "Enter your email."
    : !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? "Enter a valid email, e.g. name@example.com." : "",

  phone: v => {
    if (!v) return "Enter your phone number.";
    if (!/^\+?[0-9\s()-]+$/.test(v)) return "Use only digits, spaces, + ( ) and -.";
    const digits = v.replace(/\D/g, "").length;
    return digits < 10 || digits > 15 ? "Phone must contain 10–15 digits." : "";
  },

  sneakerCategory: v =>
    !v ? "Please select a category."
    : v !== "custom" && cartCount() === 0
      ? "Your reserve list is empty. Reserve a pair above or choose Custom Sourcing."
      : "",

  shoeSize: v => (v ? "" : "Please select your shoe size."),

  notes: v =>
    v.length > 200 ? `Notes are too long (${v.length}/200).`
    : form.elements.sneakerCategory.value === "custom" && !v ? "Describe the pair you are looking for." : "",

  terms: v => (v ? "" : "You must agree to be contacted.")
};

function validateField(id) {
  const field = form.elements[id];
  if (!field) return true;
  const value = field.type === "checkbox" ? (field.checked ? "yes" : "") : field.value.trim();
  const message = rules[id](value);

  field.classList.toggle("is-invalid", message !== "");
  const err = document.getElementById(`err-${id}`);
  if (err) err.textContent = message;
  return message === "";
}

function clearErrors() {
  form.querySelectorAll(".is-invalid").forEach(f => f.classList.remove("is-invalid"));
  form.querySelectorAll(".invalid-feedback").forEach(e => (e.textContent = ""));
}

if (form) {
  Object.keys(rules).forEach(id => {
    const field = form.elements[id];
    if (!field) return;
    field.addEventListener("blur", () => validateField(id));
    const evt = field.type === "checkbox" || field.tagName === "SELECT" ? "change" : "input";
    field.addEventListener(evt, () => {
      if (field.classList.contains("is-invalid")) validateField(id);
    });
  });

  // notes become required for "custom": re-check them when the category changes
  form.elements.sneakerCategory.addEventListener("change", () => {
    if (form.elements.notes.classList.contains("is-invalid") || form.elements.notes.value) validateField("notes");
  });

  // the category rule depends on the reserve list: re-check when the list changes
  $(document).on("cart:changed", () => {
    if (form.elements.sneakerCategory.classList.contains("is-invalid")) validateField("sneakerCategory");
  });

  form.addEventListener("submit", e => {
    e.preventDefault();
    const results = Object.keys(rules).map(validateField);

    if (!results.every(Boolean)) {
      const firstInvalid = form.querySelector(".is-invalid");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const name = form.elements.fullName.value.trim().split(/\s+/)[0];
    const total = $("#cartTotal").text() || "$0";

    $("#formSuccess")
      .text(`Request sent, ${name}! Your reserve total is ${total}. Beka's team will contact you within 24 hours.`)
      .stop(true, true).hide().slideDown(300).delay(5000).slideUp(300);

    form.reset();
    clearErrors();
    if (typeof window.clearCart === "function") window.clearCart();
  });
}