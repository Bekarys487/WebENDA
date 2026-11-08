const form = document.getElementById("sneakerForm");

const rules = {
  fullName: v => !v ? "Enter your full name." : !/^[A-Za-zА-Яа-яЁё\s'-]{2,}$/.test(v) ? "Use letters only, at least 2 characters." : "",
  emailAddr: v => !v ? "Enter your email." : !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? "Enter a valid email format." : "",
  phone: v => !v ? "Enter your phone number." : !/^\+?[0-9\s()-]{10,16}$/.test(v) ? "Use 10-15 digits only." : "",
  sneakerCategory: v => v ? "" : "Please select a category.",
  shoeSize: v => v ? "" : "Please select your shoe size.",
  notes: v => v.length > 200 ? `Notes are too long (${v.length}/200).` : "",
  terms: v => v ? "" : "You must agree to the terms."
};

function validateField(id) {
  const field = form.elements[id];
  const value = field.type === "checkbox" ? (field.checked ? "yes" : "") : field.value.trim();
  const message = rules[id](value);
  
  field.classList.toggle("is-invalid", message !== "");
  document.getElementById(`err-${id}`).textContent = message;
  
  return message === "";
}

Object.keys(rules).forEach(id => {
  const field = form.elements[id];
  field.addEventListener("blur", () => validateField(id));
  field.addEventListener("input", () => {
      if (field.classList.contains("is-invalid")) validateField(id);
  });
});

form.addEventListener("submit", e => {
  e.preventDefault();
  const results = Object.keys(rules).map(validateField);
  
  if (!results.every(Boolean)) {
    form.querySelector(".is-invalid").focus();
    return; // Останавливаем если есть ошибки
  }
  
  const name = form.elements.fullName.value.trim().split(" ")[0];
  const total = document.getElementById("cartTotal").textContent;
  
  $("#formSuccess")
    .text(`Order placed, ${name}! Your total reserve is ${total}.`)
    .stop(true, true).hide().slideDown(300).delay(5000).slideUp(300);
  
  form.reset();
  
  if (typeof window.clearCart === "function") {
      window.clearCart();
  }
});