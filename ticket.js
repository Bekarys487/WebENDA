// Task 3: Ticket builder with live validation
const TICKET_TYPES = [
  { id: 'std', name: 'Standard', price: 5000, seats: 10 },
  { id: 'vip', name: 'VIP', price: 15000, seats: 3 }
];
const SOLD_OUT_DATES = ['2026-12-25', '2026-12-31'];
const PROMOS = [
  { code: 'STUDENT', discount: 0.2 },
  { code: 'EARLY', discount: 0.1 }
];

const tform = document.getElementById('ticket-form');
tform.noValidate = true; // turn off browser messages, attributes still work
const summary = document.getElementById('form-summary');
const preview = document.getElementById('preview');
const result = document.getElementById('result');
const typeSelect = document.getElementById('type');
const fields = Array.from(tform.querySelectorAll('input, select'));
const touched = new Set();

function fillTypes() {
  const keep = typeSelect.value;
  typeSelect.replaceChildren();
  const first = document.createElement('option');
  first.value = '';
  first.textContent = 'Select...';
  typeSelect.appendChild(first);
  for (const t of TICKET_TYPES) {
    const o = document.createElement('option');
    o.value = t.id;
    o.textContent = t.name + ' — ' + t.price + ' ₸ (' + t.seats + ' left)';
    typeSelect.appendChild(o);
  }
  typeSelect.value = keep;
}

function findType() {
  return TICKET_TYPES.find(t => t.id === typeSelect.value);
}
function findPromo() {
  const code = tform.elements.promo.value.trim().toUpperCase();
  return PROMOS.find(p => p.code === code);
}

// returns an error message or '' for one field
function getError(el) {
  const v = el.value.trim();
  if (el.validity.valueMissing) return 'This field is required.';
  if (el.validity.typeMismatch) return 'Enter a valid email, for example name@mail.com.';
  if (el.validity.tooShort) return 'At least ' + el.minLength + ' characters.';
  if (el.validity.rangeUnderflow || el.validity.rangeOverflow) {
    return 'Quantity must be from ' + el.min + ' to ' + el.max + '.';
  }
  switch (el.name) {
    case 'date': {
      const today = new Date().toISOString().slice(0, 10);
      if (v < today) return 'The date cannot be in the past.';
      if (SOLD_OUT_DATES.includes(v)) return 'Tickets for this date are sold out.';
      break;
    }
    case 'qty': {
      const t = findType();
      if (t && Number(v) > t.seats) return 'Only ' + t.seats + ' tickets of this type are left.';
      break;
    }
    case 'name':
      if (!/^[A-Za-z-]+\s+[A-Za-z-]+$/.test(v)) return 'Enter first and last name separated by a space, letters only.';
      break;
    case 'promo':
      if (v !== '' && !findPromo()) return 'This promo code does not exist.';
      break;
  }
  return '';
}

function showError(el, message) {
  const span = document.getElementById(el.id + '-error');
  span.textContent = message;
  el.classList.toggle('invalid', message !== '');
  el.setAttribute('aria-invalid', message !== '' ? 'true' : 'false');
  el.setAttribute('aria-describedby', span.id);
  return message !== '';
}

function validateField(el) {
  return showError(el, getError(el));
}

function updatePreview() {
  const f = tform.elements;
  const t = findType();
  const qty = Number(f.qty.value) || 0;
  const promo = findPromo();
  let total = t ? t.price * qty : 0;
  if (promo) total = Math.round(total * (1 - promo.discount));

  preview.replaceChildren();
  const lines = [
    f.event.value || 'No event selected',
    f.date.value || 'No date selected',
    (t ? t.name : 'No type selected') + ' × ' + qty,
    f.name.value.trim() || 'No name entered',
    'Total: ' + total + ' ₸' + (promo ? ' (' + promo.discount * 100 + '% off)' : '')
  ];
  for (const line of lines) {
    const p = document.createElement('p');
    p.textContent = line;
    preview.appendChild(p);
  }
}

function bookingCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function showTicket() {
  const f = tform.elements;
  const t = findType();
  const qty = Number(f.qty.value);
  const promo = findPromo();
  let total = t.price * qty;
  if (promo) total = Math.round(total * (1 - promo.discount));
  t.seats -= qty; // seats left decrease

  const box = document.createElement('div');
  box.className = 'ticket success';
  const lines = [
    'Booking code: ' + bookingCode(),
    f.event.value + ', ' + f.date.value,
    t.name + ' × ' + qty,
    f.name.value.trim() + ' (' + f.email.value.trim() + ')',
    'Paid: ' + total + ' ₸'
  ];
  for (const line of lines) {
    const p = document.createElement('p');
    p.textContent = line;
    box.appendChild(p);
  }
  result.querySelector('.empty')?.remove();
  result.prepend(box);
}

// blur: first check; input: re-check after that
for (const el of fields) {
  el.addEventListener('blur', () => {
    touched.add(el.name);
    validateField(el);
  });
  el.addEventListener('input', () => {
    if (touched.has(el.name)) validateField(el);
    // fields that depend on others
    if (el.name === 'type' && touched.has('qty')) validateField(tform.elements.qty);
    updatePreview();
  });
}

tform.addEventListener('submit', (e) => {
  e.preventDefault();
  let count = 0;
  let firstBad = null;
  for (const el of fields) {
    touched.add(el.name);
    if (validateField(el)) {
      count++;
      if (!firstBad) firstBad = el;
    }
  }
  if (count > 0) {
    summary.textContent = 'Errors in the form: ' + count;
    summary.className = 'bad';
    firstBad.focus();
    return;
  }
  showTicket();
  tform.reset();
  touched.clear();
  for (const el of fields) {
    showError(el, '');
    el.removeAttribute('aria-invalid');
  }
  summary.textContent = 'Ticket booked!';
  summary.className = 'good';
  fillTypes();
  updatePreview();
});

fillTypes();
updatePreview();