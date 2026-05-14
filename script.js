/* LOCATIONS */

/*  Assigned Location */
var locations = [
  {
    name:   "Plaza del Sol Performance Hall",
    bounds: { north: 34.24080, south: 34.24010, east: -118.52600, west: -118.52720 }
  },

/*  Locations  */
  {
    name:   "Bayramian Hall",
    bounds: { north: 34.24075, south: 34.23995, east: -118.53075, west: -118.53190 }
  },
  {
    name:   "CSUN Bookstore",
    bounds: { north: 34.23780, south: 34.23695, east: -118.52760, west: -118.52875 }
  },
  {
    name:   "Jacaranda Hall",
    bounds: { north: 34.24155, south: 34.24070, east: -118.52835, west: -118.52950 }
  },
  {
    name:   "Manzanita Hall",
    bounds: { north: 34.23815, south: 34.23730, east: -118.52960, west: -118.53095 }
  }
];

var map;
var currentIndex = 0;
var score = 0;
var shapes = [];
var accepting = false;

var heatmap;
var clickPoints = [];

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 34.2400, lng: -118.5290 },
    zoom: 16,
    gestureHandling:        'none',
    zoomControl:            false,
    mapTypeControl:         false,
    streetViewControl:      false,
    rotateControl:          false,
    fullscreenControl:      false,
    scaleControl:           false,
    disableDoubleClickZoom: true,
    draggable:              false,
    scrollwheel:            false,
    keyboardShortcuts:      false
  });

  map.addListener('dblclick', function(event) {
    if (!accepting) return;
    checkAnswer(event.latLng);
  });

  showQuestion();
}

function showQuestion() {
  if (currentIndex >= locations.length) {
    endGame();
    return;
  }
  var loc = locations[currentIndex];
  addLog('Where is the ' + loc.name + '?', 'question');
  accepting = true;
}

function checkAnswer(latLng) {
  accepting = false;

  clickPoints.push(new google.maps.LatLng(latLng.lat(), latLng.lng()));

  var loc = locations[currentIndex];
  var lat = latLng.lat();
  var lng = latLng.lng();

  var correct =
    lat >= loc.bounds.south &&
    lat <= loc.bounds.north &&
    lng >= loc.bounds.west  &&
    lng <= loc.bounds.east;

  if (correct) {
    score++;
    drawRect(loc.bounds, '#00cc00');
    addLog('Your answer is correct!!', 'correct');
  } else {
    var clickBounds = {
      north: lat + 0.0003,
      south: lat - 0.0003,
      east:  lng + 0.0003,
      west:  lng - 0.0003
    };
    drawRect(clickBounds, '#ff0000');
    drawRect(loc.bounds, '#00cc00');
    addLog('Sorry wrong location.', 'incorrect');
  }

  currentIndex++;
  setTimeout(showQuestion, 1200);
}

function drawRect(bounds, color) {
  var rect = new google.maps.Rectangle({
    bounds: new google.maps.LatLngBounds(
      { lat: bounds.south, lng: bounds.west },
      { lat: bounds.north, lng: bounds.east }
    ),
    fillColor:    color,
    fillOpacity:  0.4,
    strokeColor:  color,
    strokeWeight: 2,
    map: map
  });
  shapes.push(rect);
}

function addLog(text, cssClass) {
  var log = document.getElementById('log');
  var p = document.createElement('p');
  p.className = cssClass;
  p.textContent = text;
  log.appendChild(p);
}

function endGame() {
  var incorrect = locations.length - score;
  document.getElementById('final-score').textContent =
    score + ' Correct, ' + incorrect + ' Incorrect';

  /* Heatmap Layer - displays all user click points on the map when the game ends */
  heatmap = new google.maps.visualization.HeatmapLayer({
    data:        new google.maps.MVCArray(clickPoints),
    map:         map,
    radius:      80,
    opacity:     0.8,
    dissipating: true
  });
}