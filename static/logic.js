// *** Leaflet JS map creation *** 
// adapted from the leaflet JS quickstart doc, instantiate map at html #mapid with center on London and only a slight zoom. 
var mymap = L.map('mapid').setView([51.505, -0.09], 4);

// add the base tile layer (the world map) from mapbox. accessToken is my own. Then add it to mymap.
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    id: 'mapbox.satellite',
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

    /*** First get marker color and radius 
     * based on earthquake magnitude classes
     * found here: http://www.geo.mtu.edu/UPSeis/magnitude.html */
    function getRadius(d){
        return d > 8  ? 42 :
        d > 7  ? 36 :
        d > 6  ? 30 :
        d > 5   ? 24 :
        d > 4   ? 18 :
        d > 3   ? 12 :
                6;
    }
    function getColor(d) { // ranges from pale yellowish to dark reddish
        return d > 8 ? '#BD0026' :
            d > 7  ? '#E31A1C':
            d > 6  ? '#FC4E2A' :
            d > 5  ? '#FD8D3C' :
            d > 4   ? '#FEB24C' :
            d > 3   ? '#FFEDA0' :
                        '#fff6cf';
    }
    function geojsonMarkerOptions(feature) {
        return {
            radius: getRadius(feature.properties.mag),
            fillColor: getColor(feature.properties.mag),
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.9
        };

    } // end geojsonMarkerOptions()

    function onEachFeature(feature, layer) {
        // if properties is not empty?
        if (feature.properties) {
            layer.bindPopup(
                "Event: " + feature.properties.title 
                + "<hr>Time: " 
                + getTime(feature.properties.time)
            );
            function getTime(feature) {//function to get date from UTC time stamp 
                var date = new Date(feature);
                // Day part of the timestamp
                var getDate = date.getUTCDate();
                // month part of the timestamp
                var utcMonth = date.getUTCMonth();
                // returns the month based on UTC month (range: 0-11)
                var month = new Array(12);
                    month[0] = "January";
                    month[1] = "February";
                    month[2] = "March";
                    month[3] = "April";
                    month[4] = "May";
                    month[5] = "June";
                    month[6] = "July";
                    month[7] = "August";
                    month[8] = "September";
                    month[9] = "October";
                    month[10] = "November";
                    month[11] = "December";
                var getMonth = month[utcMonth];
                // Hours part from the timestamp
                var hours = date.getUTCHours();
                // Minutes part from the timestamp
                var minutes = "0" + date.getUTCMinutes();
                // Will display time in 10:30:23 format
                var formattedTime = getMonth + " " + getDate + " - " 
                    + hours + ':' + minutes.substr(-2) + " UTC"; 
                return formattedTime;
            }
        }
    } //end onEachFeature()

    // *** leaflet geoJSON to convert data into circles on the map w/ other features
    L.geoJSON(Earthquakes_data, {
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng);
            },
            style: geojsonMarkerOptions,
            onEachFeature: onEachFeature
        }).addTo(mymap); // end geoJSON

    // *** Create legend
    // adapted from http://leafletjs.com/examples/choropleth/
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 4, 5, 6, 7, 8],
            labels = ["Minor", "Light", "Moderate", "Strong", "Major", "Great"];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                "(" + grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + ") " 
                + labels[i] + '<br>' : "+)  " + labels[i]);
        }

        return div;
    };

    legend.addTo(mymap);
} //end createFeatures()
