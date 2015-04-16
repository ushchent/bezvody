var map, jsonData, address, mapPlaceHolder = document.getElementById("mapDiv");

function insertMap() {
    var mapParameters = {
        center: new google.maps.LatLng(53.90, 27.56),
        zoom: 11,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(mapPlaceHolder, mapParameters);
}

function addMarkers() {
    for (var i = 0; i < jsonData.length; i++) {
        var coordinates = new google.maps.LatLng(jsonData[i].lat, jsonData[i].lon);
        var address = '<div style="width: 200px, height: 100px;"><b>Адрес:</b> ' + jsonData[i].type + " " + jsonData[i].name + ", " + jsonData[i].house + '<br>Горячей воды не будет с ' + jsonData[i].start + ' по ' + jsonData[i].end + '</div>';
        var toolTip = new google.maps.InfoWindow({
           content: address
        });
        var marker = new google.maps.Marker({
            position: coordinates,
            map: map,
            infowindow: toolTip
        });
        google.maps.event.addListener(marker, "click", function() {
            this.infowindow.open(map, this);
        });
    };
}

window.onload = function() {
    insertMap();
    var request = new XMLHttpRequest();
    request.onreadystatechange = function(){
        if (request.readyState === 4) {
            data = request.responseText;
            jsonData = JSON.parse(data);
            addMarkers();
        }
    };
    request.open("GET", "data/data.json", true);
    request.send(null);
};  
