
//Calling the USGS website
let queryUrl= "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


  //  Query the URL
 d3.json(queryUrl).then(function (data) {
 console.log(data);

  // Data.features object to createFeatures function.
  createFeatures(data.features);
});


// Configuring marker size and color
function markerSize(magnitude) {
  return magnitude * 2000;
};

function getColor(depth) {
      switch(true) {
        case depth > 90:
          return "red";
        case depth > 70:
          return "orangered";
        case depth > 50:
          return "orange";
        case depth > 30:
          return "gold";
        case depth > 10:
          return "yellow";
        default:
          return "green";
      }
    }



function createFeatures(earthquakeData) {

  // Configuring popup that with place and time of the earthquake.

  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p>Date: ${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
  }

  // GeoJSON with the features array on the earthquakeData
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,

  // Poin to layer for markers
    pointToLayer: function(feature, latlng) {

      // Calling markers configuration according to depth and size
      var markers = {
        radius: markerSize(feature.properties.mag),
        fillColor: getColor(feature.geometry.coordinates[2]),
        color: "black",
        stroke: true,
        weight: 0.5
      }
      return L.circle(latlng,markers);
    }
  });

  createMap(earthquakes);
}

function createMap(earthquakes) {

  var scale = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  var baseMaps = {
        "scale Map": scale

  }
  // Create an overlay
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Creating map with desire lattitude and longitude
  var myMap = L.map("map", {
    center: [32.82,-117.43],
    zoom: 8,
    layers: [scale, earthquakes]
  });


  
// Add legend with colors
var legend = L.control({position: "bottomright"});
legend.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend"),
  depth = [-10, 10, 30, 50, 70, 90];

  for (var i = 0; i < depth.length; i++) {

    div.innerHTML +=
    //'<i style="background:' + getColor(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
    '<i style="background:' + getColor(depth[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
    depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
  }
  return div;
};
legend.addTo(myMap)


}