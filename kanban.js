// Task 2: Kanban board built from data
const STATUSES = [
  { id: 'todo', title: 'To do' },
  { id: 'progress', title: 'In progress' },
  { id: 'done', title: 'Done' }
];
const WIP_LIMIT = 3; // max cards in the middle column
const PRIORITY_NAMES = { 1: 'high', 2: 'medium', 3: 'low' };

const tasks = [
  { id: 1, title: 'Build the header', tag: 'html', priority: 1, urgent: true, status: 'todo' },
  { id: 2, title: 'Connect fonts', tag: 'css', priority: 3, urgent: false, status: 'todo' },
  { id: 3, title: 'Write the game', tag: 'js', priority: 1, urgent: true, status: 'progress' },
  { id: 4, title: 'Responsive 375px', tag: 'css', priority: 2, urgent: false, status: 'todo' },
  { id: 5, title: 'Form validation', tag: 'js', priority: 2, urgent: false, status: 'todo' },
  { id: 6, title: 'Create repository', tag: 'git', priority: 1, urgent: false, status: 'done' },
  { id: 7, title: 'Write the report', tag: 'docs', priority: 2, urgent: false, status: 'todo' },
  { id: 8, title: 'GitHub Pages', tag: 'git', priority: 3, urgent: false, status: 'todo' },
  { id: 9, title: 'Check accessibility', tag: 'html', priority: 2, urgent: false, status: 'progress' },
  { id: 10, title: 'Report screenshots', tag: 'docs', priority: 3, urgent: false, status: 'done' },
  { id: 11, title: 'Prepare the defense', tag: 'docs', priority: 1, urgent: true, status: 'todo' }
];

const board = document.getElementById('board');
const tagFilter = document.getElementById('tag-filter');
const sortBox = document.getElementById('sort-priority');
const boardMsg = document.getElementById('board-msg');
const progress = document.getElementById('progress');
const progressText = document.getElementById('progress-text');

// own loop: count cards in a column
function countByStatus(status) {
  let n = 0;
  for (const t of tasks) {
    if (t.status === status) n++;
  }
  return n;
}

function makeCard(task, statusIndex) {
  const card = document.createElement('article');
  card.className = 'card' + (task.urgent ? ' urgent' : '');

  const title = document.createElement('strong');
  title.textContent = task.title;
  const meta = document.createElement('p');
  meta.textContent = '#' + task.tag + ' · priority: ' + PRIORITY_NAMES[task.priority];

  const actions = document.createElement('div');
  actions.className = 'actions';
  if (statusIndex > 0) actions.appendChild(makeBtn('←', 'left', task.id, 'Move back: ' + task.title));
  if (statusIndex < STATUSES.length - 1) actions.appendChild(makeBtn('→', 'right', task.id, 'Move forward: ' + task.title));

  card.append(title, meta, actions);
  return card;
}

function makeBtn(text, action, id, label) {
  const b = document.createElement('button');
  b.type = 'button';
  b.textContent = text;
  b.dataset.action = action;
  b.dataset.id = id;
  b.setAttribute('aria-label', label);
  return b;
}

// the only render function, called after every change
function render() {
  board.replaceChildren();
  const tag = tagFilter.value;

  STATUSES.forEach((status, index) => {
    const col = document.createElement('section');
    col.className = 'column';
    const h = document.createElement('h3');
    const total = countByStatus(status.id);
    h.textContent = status.title + ' (' + total + (status.id === 'progress' ? '/' + WIP_LIMIT : '') + ')';
    col.appendChild(h);

    let list = tasks.filter(t => t.status === status.id && (tag === '' || t.tag === tag));
    if (sortBox.checked) list = list.slice().sort((a, b) => a.priority - b.priority);

    if (list.length === 0) {
      const p = document.createElement('p');
      p.className = 'empty';
      p.textContent = 'Nothing found';
      col.appendChild(p);
    }
    for (const task of list) col.appendChild(makeCard(task, index));
    board.appendChild(col);
  });

  const done = countByStatus('done');
  progress.value = Math.round((done / tasks.length) * 100);
  progressText.textContent = done + ' of ' + tasks.length;
}

function move(id, dir) {
  const task = tasks.find(t => t.id === id);
  const index = STATUSES.findIndex(s => s.id === task.status);
  const target = STATUSES[index + dir];
  if (!target) return;
  if (target.id === 'progress' && countByStatus('progress') >= WIP_LIMIT) {
    boardMsg.textContent = 'Not allowed: "In progress" can hold at most ' + WIP_LIMIT + ' cards.';
    boardMsg.className = 'bad';
    return; // data not changed
  }
  task.status = target.id;
  boardMsg.textContent = '';
  boardMsg.className = '';
  render();
}

// event delegation: one listener for all buttons
board.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;
  move(Number(btn.dataset.id), btn.dataset.action === 'right' ? 1 : -1);
});
tagFilter.addEventListener('change', render);
sortBox.addEventListener('change', render);

function initFilter() {
  const tags = [];
  for (const t of tasks) {
    if (!tags.includes(t.tag)) tags.push(t.tag);
  }
  const all = document.createElement('option');
  all.value = '';
  all.textContent = 'All';
  tagFilter.appendChild(all);
  for (const tag of tags) {
    const o = document.createElement('option');
    o.value = tag;
    o.textContent = tag;
    tagFilter.appendChild(o);
  }
}

initFilter();
render();