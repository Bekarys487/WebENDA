// Task 1: Code breaker
const CODE_LENGTH = 4;
const MAX_ATTEMPTS = 8;
const MIN_DIGIT = 0;
const MAX_DIGIT = 9;

const form = document.getElementById('guess-form');
const input = document.getElementById('guess');
const msg = document.getElementById('game-msg');
const attemptsEl = document.getElementById('attempts');
const historyEl = document.getElementById('history');
const guessBtn = document.getElementById('guess-btn');

let secret = [];
let attempts = 0;
let finished = false;

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateSecret() {
  const pool = [];
  for (let d = MIN_DIGIT; d <= MAX_DIGIT; d++) pool.push(d);
  const code = [];
  while (code.length < CODE_LENGTH) {
    const i = randomInt(0, pool.length - 1);
    code.push(pool.splice(i, 1)[0]); // each digit used once
  }
  return code;
}

function setMessage(text, type) {
  msg.textContent = text;
  msg.className = type || '';
}

function updateState() {
  attemptsEl.textContent = 'Attempts left: ' + (MAX_ATTEMPTS - attempts);
  input.disabled = finished;
  guessBtn.disabled = finished;
}

function validate(value) {
  if (value.length !== CODE_LENGTH || !/^[0-9]+$/.test(value)) {
    return 'Enter exactly ' + CODE_LENGTH + ' digits.';
  }
  if (new Set(value).size !== CODE_LENGTH) {
    return 'Digits must not repeat.';
  }
  return '';
}

function check(value) {
  let right = 0;
  let wrong = 0;
  for (let i = 0; i < CODE_LENGTH; i++) {
    const d = Number(value[i]);
    if (d === secret[i]) right++;
    else if (secret.includes(d)) wrong++;
  }
  return { right, wrong };
}

function addHistory(value, res) {
  const li = document.createElement('li');
  li.textContent = value + ' — right place: ' + res.right + ', wrong place: ' + res.wrong;
  historyEl.appendChild(li);
}

function startGame() {
  secret = generateSecret();
  attempts = 0;
  finished = false;
  historyEl.replaceChildren();
  input.value = '';
  setMessage('Game started. Good luck!', '');
  updateState();
  input.focus();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (finished) return;
  const value = input.value.trim();
  const error = validate(value);
  if (error) { // state is not changed
    setMessage(error, 'bad');
    return;
  }
  attempts++;
  const res = check(value);
  addHistory(value, res);
  input.value = '';

  const won = res.right === CODE_LENGTH;
  const lost = !won && attempts >= MAX_ATTEMPTS;
  if (won) {
    finished = true;
    setMessage('You win! The code was ' + secret.join(''), 'good');
  } else if (lost) {
    finished = true;
    setMessage('You lose. The code was ' + secret.join(''), 'bad');
  } else if (res.right === 0 && res.wrong === 0) {
    setMessage('No matching digits.', '');
  } else {
    setMessage('Keep going.', '');
  }
  updateState();
});

document.getElementById('restart-btn').addEventListener('click', startGame);
startGame();