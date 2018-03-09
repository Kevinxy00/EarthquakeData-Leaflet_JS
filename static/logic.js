// *** Leaflet JS map creation *** 
// adapted from the leaflet JS quickstart doc, instantiate map at html #mapid with center on London and only a slight zoom. 
var mymap = L.map('mapid').setView([51.505, -0.09], 4);

// add the base tile layer (the world map) from mapbox. accessToken is my own. Then add it to mymap.
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1Ijoia2V2aW54eTAwIiwiYSI6ImNqZWJrcDFyczBjZHkycm85bTBtdzNjcjcifQ.5h1SaoW7n6f9YA4mF_dZTA'
}).addTo(mymap);

// api from earthquake.usgs.gov
    // all earthquakes from the past week
var Earthquakes_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(Earthquakes_url, function(data){
// send the features in the response to the createFeatures function
createFeatures(data.features);

});

// takes in api data, features object, which is an array of objects, and adds geojson objects to map
function createFeatures(Earthquakes_data) {

    var geojsonMarkerOptions = {
        radius: 8,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    L.geoJSON(Earthquakes_data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, geojsonMarkerOptions);
        }
    }).addTo(mymap);

}