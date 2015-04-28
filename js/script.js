var map,
    jsonData,
    icon,
    timeSpan = 86400000 * 14,
    markerclusterer,
    today = new Date("2015-05-26");

function insertMap() {
    var mapParameters = {
        center: new google.maps.LatLng(53.90, 27.56),
        zoom: 11,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("mapDiv"), mapParameters);
}

function menuAction() {
    var buttons = document.getElementById("menu").getElementsByTagName("input");
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].onclick = function() {
            markerclusterer.clearMarkers();
            selectData(this.getAttribute("id"));
        }
    }
}

function selectData(input) {
    var newData = [];
    for (var i = 0; i < jsonData.length; i++) {
        var startDate = new Date(jsonData[i].start);       
        if (input == "uzhe_otkliuchili") {
            if (startDate.getTime() <= today.getTime() && startDate.getTime() >= today.getTime() - timeSpan) {
                newData.push(jsonData[i]);
                icon = "img/blue.png";
            }
            
        } else if (input == "skoro_otkliuchat") {
            if (startDate.getTime() > today.getTime()) {
                newData.push(jsonData[i]);
                icon = "img/yellow.png";
            }

        } else if (input == "dolzhny_vkliuchit") {
            if (startDate.getTime() < today.getTime() - timeSpan) {
                newData.push(jsonData[i]);
                icon = "img/red.png";
            }
        }
    }
    addMarkers(newData, input, icon)
}

function addMarkers(indata, input) {
    var markers = [];

    for (var i = 0; i < indata.length; i++) {
            var coordinates = new google.maps.LatLng(indata[i].lat, indata[i].lon);
            var address = '<div style="width: 200px, height: 100px;"><b>Адрес:</b> ' +
                indata[i].type + " " + indata[i].name + ", " + indata[i].house +
                '<br>Горячую воду отключат ' + indata[i].start + '</div>';
            var marker = new google.maps.Marker({
                position: coordinates,
                map: map,
                infowindow: new google.maps.InfoWindow({
                content: address
                })
            });
                google.maps.event.addListener(marker, 'click', function() {
                    this.infowindow.open(map, this);
                });
            markers.push(marker);
    };
    var mcOptions = {styles: [{
            height: 52,
            url: icon,
            width: 53
                }]
            };
    markerclusterer = new MarkerClusterer(map, markers, mcOptions);
    document.getElementById(input).classList.add("active");
}

window.onload = function() {
    insertMap();
    var request = new XMLHttpRequest();
    request.onreadystatechange = function(){
        if (request.readyState === 4) {
            data = request.responseText;
            jsonData = JSON.parse(data);
            selectData("uzhe_otkliuchili")
            menuAction();
        }
    };
    request.open("GET", "data/data.json", true);
    request.send(null);
};
