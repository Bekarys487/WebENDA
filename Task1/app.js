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
    return m >= 1230 && m <= 1260;    
  });
}
function solve8() {
  return $('.visitor:not(.aitu)').filter(function () {
    return $(this).data('min') > 1260;  
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

function runCase(n) {
  buildHouse();
  var item = TASKS[n - 1];
  var found = item[1]();

  if (typeof onResult === 'function') { onResult(found, n); }

  found.not('.zone').animate({ top: -14 }, 150).animate({ top: 0 }, 150);
  found.addClass('mark');

  var names = [];
  found.each(function () { names.push($(this).data('name')); });

  var code = item[1].toString();
  $('#answer').html('<b>Case ' + n + ': ' + item[0] + '</b><br>Found ' + found.length + ': ' +
    names.join(', ') + '<code></code>');
  $('#answer code').text(code);
}

for (var i = 0; i < TASKS.length; i++) {
  $('#caseBar').append('<button title="' + TASKS[i][0] + '">Case ' + (i + 1) + '</button>');
}
$('#caseBar').on('click', 'button[title]', function () {
  runCase($(this).index() + 1);
});

buildHouse();