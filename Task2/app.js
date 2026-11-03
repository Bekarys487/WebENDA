// ---------- PARTY: the party from the picture ----------
function newPerson(name, color, time, aitu, items) {
  return { name: name, color: color, time: time, aitu: aitu, items: items };
}

var PARTY = [
  { id: 'balcony', name: 'Balcony', level: 2, crowd: [
    newPerson('Aigerim', 'green', '20:45', 1, 'cup crumbs'),
    newPerson('Aliya', 'black', '21:15', 0, 'phone cup'),
    newPerson('Madina', 'green', '22:10', 0, 'phone bag crumbs'),
    newPerson('Ivan', 'black', '20:10', 1, 'cup')
  ] },
  { id: 'hall', name: 'Hall', level: 2, crowd: [
    newPerson('Arman', 'yellow', '20:35', 1, 'bag glasses'),
    newPerson('Sophia', 'purple', '21:20', 1, 'phone'),
    newPerson('Dias', 'green', '19:45', 1, ''),
    newPerson('Bekzat', 'purple', '20:55', 0, 'bag cup crumbs'),
    newPerson('Aruzhan', 'black', '21:50', 1, 'phone'),
    newPerson('Saule', 'green', '21:25', 0, 'glasses')
  ] },
  { id: 'kitchen', name: 'Kitchen', level: 1, crowd: [
    newPerson('Nurlan', 'red', '19:40', 1, 'phone cup'),
    newPerson('Emma', 'black', '20:15', 0, 'bag'),
    newPerson('Timur', 'green', '21:05', 1, 'phone bag crumbs'),
    newPerson('Sergey', 'yellow', '20:50', 0, ''),
    newPerson('Yerlan', 'red', '21:40', 1, 'glasses phone'),
    newPerson('Kamila', 'black', '20:05', 0, 'cup')
  ] },
  { id: 'living', name: 'Living room', level: 1, crowd: [
    newPerson('Daniel', 'blue', '19:55', 1, 'glasses'),
    newPerson('Zarina', 'green', '21:10', 0, 'bag phone crumbs'),
    newPerson('Natasha', 'yellow', '20:30', 1, ''),
    newPerson('Askar', 'black', '21:00', 1, 'phone'),
    newPerson('Inkar', 'purple', '20:20', 0, 'bag')
  ] }
];

var SYMBOLS = { phone: '📱', glasses: '👓', bag: '👜', cup: '☕', crumbs: '🍰' };

// ---------- helpers ----------
function toMinutes(t) {
  var parts = t.split(':');
  return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
}

function buildCard(g) {
  var items = g.items === '' ? [] : g.items.split(' ');
  var icons = '';
  for (var i = 0; i < items.length; i++) {
    icons += SYMBOLS[items[i]] + ' ';
  }
  var cls = 'visitor ' + g.color;
  if (g.aitu) { cls += ' aitu'; }
  if (g.items !== '') { cls += ' ' + g.items; }

  var html = '<div class="' + cls + '" data-name="' + g.name + '" data-color="' + g.color +
    '" data-time="' + g.time + '" data-min="' + toMinutes(g.time) +
    '" data-aitu="' + g.aitu + '" data-items="' + g.items + '">';
  if (g.aitu) { html += '<i class="ribbon">🎓</i>'; }
  html += '<span class="pic"><img src="https://api.dicebear.com/9.x/open-peeps/svg?seed=' + g.name + '" alt=""></span>';
  html += '<b>' + g.name + '</b><small>' + g.time + '</small>';
  html += '<span class="things">' + icons + '</span></div>';
  return html;
}

function buildHouse() {
  $('.glide, .panel').stop(true).remove();
  $('#mansion').empty();
  var levels = [2, 1];
  for (var f = 0; f < levels.length; f++) {
    var level = $('<div class="level" data-level="' + levels[f] + '"><b class="lvlTag">Floor ' + levels[f] + '</b></div>');
    $('#mansion').append(level);
    for (var r = 0; r < PARTY.length; r++) {
      if (PARTY[r].level !== levels[f]) { continue; }
      var zone = $('<div class="zone" data-zone="' + PARTY[r].id + '" data-name="' + PARTY[r].name + '"><h3>' + PARTY[r].name + '</h3><div class="crowd"></div></div>');
      level.append(zone);
      for (var g = 0; g < PARTY[r].crowd.length; g++) {
        zone.find('.crowd').append(buildCard(PARTY[r].crowd[g]));
      }
    }
  }
  if (typeof afterBuild === 'function') { afterBuild(); }
}

// ---------- the 20 cases: one jQuery chain each, searching the page ----------
function solve1() {
  return $('.zone[data-zone=hall] .visitor');
}
function solve2() {
  return $('.visitor.yellow, .visitor.purple');
}
function solve3() {
  return $('.level[data-level=2] .visitor.aitu');
}
function solve4() {
  return $('.visitor.glasses, .visitor.bag');
}
function solve5() {
  return $('.visitor:not(.phone):not(.glasses):not(.bag):not(.cup):not(.crumbs)');
}
function solve6() {
  return $('.visitor.phone:not(.bag)');
}
function solve7() {
  return $('.visitor').filter(function () {
    var m = $(this).data('min');
    return m >= 1230 && m <= 1260;      // 20:30 ... 21:00
  });
}
function solve8() {
  return $('.visitor:not(.aitu)').filter(function () {
    return $(this).data('min') > 1260;  // after 21:00
  });
}
function solve9() {
  return $('.visitor[data-name=Askar]').prev().add($('.visitor[data-name=Askar]').next());
}
function solve10() {
  return $('.crowd .visitor:last-child');
}
function solve11() {
  return $('.crowd .visitor:nth-child(3)');
}
function solve12() {
  return $('.visitor[data-name=Timur]').nextAll();
}
function solve13() {
  return $('.visitor.black').prev();
}
function solve14() {
  return $('.visitor[data-name=Aruzhan]').closest('.zone');
}
function solve15() {
  return $('.zone').filter(function () {
    return $(this).find('.visitor').length < 6;
  });
}
function solve16() {
  return $('.zone:has(.visitor.cup):not(:has(.visitor.glasses))');
}
function solve17() {
  return $('.zone').map(function () {
    var first = null;
    $(this).find('.visitor').each(function () {
      if (first === null || $(this).data('min') < $(first).data('min')) {
        first = this;
      }
    });
    return first;
  });
}
function solve18() {
  return $(buildCard(newPerson('Miras', 'blue', '21:20', 1, 'phone'))).hide().insertAfter('.visitor[data-name=Askar]').fadeIn(800);
}
function solve19() {
  return $('.visitor[data-name=Natasha]').fadeOut(800, function () {
    $(this).remove();
  });
}
function solve20() {
  return $('.level[data-level=1] .visitor.crumbs:not(.cup)').filter(function () {
    var m = $(this).data('min');
    return m > 1260 && m < 1290;        // after 21:00, before 21:30
  }).filter(function () {
    return $(this).prev().add($(this).next()).filter('.aitu').length > 0;
  });
}

var TASKS = [
  ['Who is in the hall?', solve1],
  ['Who is dressed in yellow or purple?', solve2],
  ['Which AITU students are upstairs?', solve3],
  ['Who has glasses or a bag?', solve4],
  ['Who came with nothing at all?', solve5],
  ['Who has a phone but no bag?', solve6],
  ['Who arrived 20:30-21:00 (included)?', solve7],
  ['Who arrived after 21:00 and is not AITU?', solve8],
  ['Who stands right next to Askar?', solve9],
  ['Who stands last in each zone?', solve10],
  ['Who stands third in each zone?', solve11],
  ['Who stands after Timur in his zone?', solve12],
  ['Who stands right before someone in black?', solve13],
  ['In which zone is Aruzhan?', solve14],
  ['Which zones have fewer than 6 crowd?', solve15],
  ['Rooms with a cup but nobody with glasses?', solve16],
  ['Who came first to each zone?', solve17],
  ['Miras joins between Askar and Inkar', solve18],
  ['Natasha goes home', solve19],
  ['Who took the cake?', solve20]
];

// ---------- run a case ----------
function runCase(n) {
  buildHouse();
  var item = TASKS[n - 1];
  var found = item[1]();

  if (typeof onResult === 'function') { onResult(found, n); }

  // found crowd jump once (zones only get highlighted)
  found.not('.zone').animate({ top: -14 }, 150).animate({ top: 0 }, 150);
  found.addClass('mark');

  var names = [];
  found.each(function () { names.push($(this).data('name')); });

  var code = item[1].toString();
  $('#answer').html('<b>Case ' + n + ': ' + item[0] + '</b><br>Found ' + found.length + ': ' +
    names.join(', ') + '<code></code>');
  $('#answer code').text(code);
}

// ---------- buttons ----------
for (var i = 0; i < TASKS.length; i++) {
  $('#caseBar').append('<button title="' + TASKS[i][0] + '">Case ' + (i + 1) + '</button>');
}
$('#caseBar').on('click', 'button[title]', function () {
  runCase($(this).index() + 1);
});

buildHouse();

/* ================= TASK 2 ================= */
var panel = null;
var WORDS = { phone: 'a phone', glasses: 'glasses', bag: 'a bag', cup: 'a cup', crumbs: 'cake crumbs' };
var STABLE = '.visitor:not(.outgoing):not(.incoming)';

$('#caseBar').append('<button id="resetBtn">Clear</button>');

function afterBuild() {
  panel = null;
  $('.zone h3').append('<button class="order">Sort by time</button>');
}

// ----- 1. Spotlight -----
function onResult(found, n) {
  if (n >= 19) { return; }            // cases 18 and 19 change the party
  var bright = found;
  if (found.is('.zone')) { bright = found.find('.visitor'); }
  $(STABLE).not(bright).stop(true).fadeTo(300, 0.2);
  if (n < 18) { bright.stop(true).fadeTo(300, 1); }
}
$('#resetBtn').click(function () {
  $(STABLE).stop(true).fadeTo(300, 1);
});

// ----- 2. Guest card -----
function closePanel() {
  if (panel === null) { return; }
  var p = panel;
  var src = p.data('src');
  panel = null;
  p.stop(true).animate({ width: 44, height: 44, left: src.left, top: src.top, opacity: 0 }, 250, function () {
    p.remove();
  });
}

function describeThings(items) {
  var words = [];
  for (var i = 0; i < items.length; i++) { words.push(WORDS[items[i]]); }
  if (words.length === 0) { return 'Has nothing'; }
  if (words.length === 1) { return 'Has ' + words[0]; }
  var last = words.panel();
  return 'Has ' + words.join(', ') + ' and ' + last;
}

function openPanel(g) {
  var o = g.find('.pic').offset();
  var d = g.data();
  var W = 230;
  var items = d.items === '' ? [] : String(d.items).split(' ');
  var zoneId = g.closest('.zone').data('zone');
  var zoneName = g.closest('.zone').data('name');

  var html = '<h4>' + d.name + '</h4>';
  html += '<p>Came at ' + d.time + '</p>';
  html += '<p>' + (d.aitu ? 'AITU student' : 'Not an AITU student') + '</p>';
  html += '<p>Wears ' + d.color + '</p>';
  html += '<p>' + describeThings(items) + '</p>';
  html += '<p>Now in the ' + zoneName.toLowerCase() + '</p>';
  for (var i = 0; i < PARTY.length; i++) {
    if (PARTY[i].id !== zoneId) {
      html += '<button data-to="' + PARTY[i].id + '">Move to the ' + PARTY[i].name.toLowerCase() + '</button>';
    }
  }

  var p = $('<div class="panel">' + html + '</div>').appendTo('body');
  p.data({ g: g, src: o });
  p.css({ width: W, height: 'auto', left: 0, top: 0 });
  var H = p.outerHeight();
  var left = o.left + 22 - W / 2;
  if (left < 6) { left = 6; }
  if (left > $(document).width() - W - 6) { left = $(document).width() - W - 6; }

  p.css({ width: 44, height: 44, left: o.left, top: o.top, opacity: 0.3 });
  panel = p;
  // show the card below the avatar; if it does not fit on the screen, show it above
  var view = $(window).scrollTop() + $(window).height();
  var top = o.top + 50;
  if (top + H > view) {
    top = o.top - H - 6;
    if (top < $(window).scrollTop() + 6) { top = $(window).scrollTop() + 6; }
  }
  p.animate({ width: W, height: H, left: left, top: top, opacity: 1 }, 300);
}

$('#mansion').on('click', '.visitor', function () {
  var same = (panel !== null && panel.data('g')[0] === this);
  closePanel();
  if (!same) { openPanel($(this)); }
});

$(document).on('click', function (e) {
  if ($(e.target).closest('.panel, .visitor').length === 0) { closePanel(); }
});
$(document).on('keydown', function (e) {
  if (e.key === 'Escape') { closePanel(); }
});

// ----- 3. Move -----
function findZone(id) {
  for (var i = 0; i < PARTY.length; i++) {
    if (PARTY[i].id === id) { return PARTY[i]; }
  }
  return null;
}

function sendVisitor(g, toId) {
  var name = g.data('name');
  var visitor = null;

  // change the array: remove from the old zone, add to the end of the new zone
  for (var r = 0; r < PARTY.length; r++) {
    for (var k = 0; k < PARTY[r].crowd.length; k++) {
      if (PARTY[r].crowd[k].name === name) {
        visitor = PARTY[r].crowd.splice(k, 1)[0];
        break;
      }
    }
  }
  findZone(toId).crowd.push(visitor);

  var w = g.width();
  var margin = parseFloat(g.css('marginLeft'));
  var from = g.offset();

  // new card in the new zone: measure its final place, then make it narrow
  var newCard = $(buildCard(visitor)).addClass('incoming').css('visibility', 'hidden');
  $('.zone[data-zone=' + toId + '] .crowd').append(newCard);
  var to = newCard.offset();
  newCard.css({ width: 0, marginLeft: 0, marginRight: 0 });
  newCard.animate({ width: w, marginLeft: margin, marginRight: margin }, 600);

  // old card: the empty place closes slowly
  g.addClass('outgoing').stop(true).css('visibility', 'hidden');
  g.animate({ width: 0, marginLeft: 0, marginRight: 0 }, 600, function () {
    g.remove();
  });

  // flying copy
  var glide = g.clone().removeClass('outgoing mark').addClass('glide');
  glide.css({ position: 'absolute', left: from.left, top: from.top, margin: 0, width: w, visibility: 'visible', opacity: 1 });
  glide.appendTo('body');
  glide.animate({ left: to.left, top: to.top }, 700, function () {
    glide.remove();
    newCard.removeClass('incoming').css({ visibility: 'visible', width: w });
  });
}

$('body').on('click', '.panel button[data-to]', function () {
  var g = panel.data('g');
  var toId = $(this).data('to');
  closePanel();
  sendVisitor(g, toId);
});

// ----- 4. Sort by time -----
$('#mansion').on('click', '.order', function () {
  var zone = $(this).closest('.zone');
  var box = zone.find('.crowd');
  var cards = box.children('.visitor').not('.outgoing, .incoming');
  var sorted = !zone.data('sorted');
  var arr = findZone(zone.data('zone')).crowd;
  zone.data('sorted', sorted);

  // 1) remember where every card is now
  var oldPos = [];
  cards.each(function (i) { oldPos[i] = $(this).offset(); });

  // 2) stop old sliding and reset
  cards.stop('sortq', true).css({ left: 0, top: 0 });

  // 3) put the cards in the new order
  var list = cards.get();
  list.sort(function (a, b) {
    if (sorted) { return $(a).data('min') - $(b).data('min'); }
    return posInList(arr, $(a).data('name')) - posInList(arr, $(b).data('name'));
  });
  for (var i = 0; i < list.length; i++) { box.append(list[i]); }

  // 4) move every card from the old place to the new place
  cards.each(function (i) {
    var now = $(this).offset();
    $(this).css({ left: oldPos[i].left - now.left, top: oldPos[i].top - now.top });
    $(this).animate({ left: 0, top: 0 }, { duration: 500, queue: 'sortq' }).dequeue('sortq');
  });
});

function posInList(arr, name) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].name === name) { return i; }
  }
  return -1;
}