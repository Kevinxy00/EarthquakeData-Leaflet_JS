// *** Leaflet JS map creation *** 
// adapted from the leaflet JS quickstart doc, instantiate map at html #mapid with center on London and only a slight zoom. 
var mymap = L.map('mapid').setView([51.505, -0.09], 4);

// add the base tile layer (the world map) from mapbox. accessToken is my own. Then add it to mymap.
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1Ijoia2V2aW54eTAwIiwiYSI6ImNqZWJrcDFyczBjZHkycm85bTBtdzNjcjcifQ.5h1SaoW7n6f9YA4mF_dZTA'
}).addTo(mymap);