var map,
    singleMarker,
    jsonData,
    clusterIcon,
    markerIcon,
    markerclusterer,
    timeSpan = 86400000 * 14,
    today = new Date();

function insertMap() {
    var mapParameters = {
        center: new google.maps.LatLng(53.90, 27.56),
        zoom: 11,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("mapDiv"), mapParameters);
}

function setMenuEvents() {
    var buttons = document.getElementById("menu").getElementsByClassName("button");
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].onclick = function() {
            markerclusterer.clearMarkers();
            if (singleMarker) {
                    singleMarker.setMap(null);
                };
            if (!map.setZoom(11)) {
                    map.setZoom(11);
                    map.setCenter(new google.maps.LatLng(53.90, 27.56));
                };
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
                clusterIcon = "img/blue.png";
                markerIcon = "http://gmaps-samples.googlecode.com/svn/trunk/markers/blue/blank.png"
            }

        } else if (input == "skoro_otkliuchat") {
            if (startDate.getTime() > today.getTime()) {
                newData.push(jsonData[i]);
                clusterIcon = "img/yellow.png";
                markerIcon = "http://gmaps-samples.googlecode.com/svn/trunk/markers/orange/blank.png"
            }

        } else if (input == "dolzhny_vkliuchit") {
            if (startDate.getTime() < today.getTime() - timeSpan) {
                newData.push(jsonData[i]);
                clusterIcon = "img/red.png";
                markerIcon = "http://gmaps-samples.googlecode.com/svn/trunk/markers/red/blank.png";
            }
        }
    }
    addMarkers(newData, clusterIcon, markerIcon)
}

function addMarkers(indata, clusterIcon, markerIcon) {
    var markers = [];
    for (var i = 0; i < indata.length; i++) {
            var coordinates = new google.maps.LatLng(indata[i].lat, indata[i].lon);
            var address = '<div style="width: 200px, height: 100px;"><b>Адрес:</b> ' +
                indata[i].address +
                '<br>Горячую воду отключают ' + indata[i].start + '</div>';
            var marker = new google.maps.Marker({
                position: coordinates,
                map: map,
                icon: markerIcon,
                infowindow: new google.maps.InfoWindow({
                content: address,
                })
            });
                google.maps.event.addListener(marker, 'click', function() {
                    this.infowindow.open(map, this);
                });
            markers.push(marker);
    };
    var mcOptions = {styles: [{
            height: 52,
            url: clusterIcon,
            width: 53
                }]
            };
    markerclusterer = new MarkerClusterer(map, markers, mcOptions);
}

function selectAddress() {
    var addresses = [];
    for (var i = 0; i < jsonData.length; i++) {
        addresses.push(jsonData[i].address);
    };
    
    $( "#autocomplete" ).autocomplete({
        source: addresses,
        minLength: 4
    });
    
    var addressField = document.getElementById("autocomplete");
    addressField.onfocus = function() {
        if (addressField.value == "Проверить адрес") {
            addressField.value = "";
        }
    };
    addressField.onblur = function() {
        if (addressField.value == "") {
            addressField.value = "Проверить адрес";
        }
    };

    var addressButton = document.getElementById("address_button");
    addressButton.onclick = function() {
        if (singleMarker) {
                singleMarker.setMap(null);
            };
        var checker = false;
        var givenAddress = document.getElementById("autocomplete").value;
        if (givenAddress == "Проверить адрес") {
            givenAddress = "Введите адрес";
            checker = true;
        };
        for (var i = 0; i < jsonData.length; i++) {
            if (givenAddress == jsonData[i].address) {
                checker = true;
                var singleMarkerIcon;
                var sDate = new Date(jsonData[i].start);   
                if (sDate.getTime() <= today.getTime() && sDate.getTime() >= today.getTime() - timeSpan) {
                    singleMarkerIcon = "http://gmaps-samples.googlecode.com/svn/trunk/markers/blue/blank.png"
                } else if (sDate.getTime() > today.getTime()) {
                    singleMarkerIcon = "http://gmaps-samples.googlecode.com/svn/trunk/markers/orange/blank.png";
                } else if (sDate.getTime() < today.getTime() - timeSpan) {
                    singleMarkerIcon = "http://gmaps-samples.googlecode.com/svn/trunk/markers/red/blank.png";
                }
                var givenAddressLatLng = new google.maps.LatLng(jsonData[i].lat, jsonData[i].lon);
                markerclusterer.clearMarkers();
                map.setCenter(givenAddressLatLng);
                map.setZoom(15);
                var address = '<div style="width: 200px, height: 100px;"><b>Адрес:</b> ' +
                    jsonData[i].address +
                    '<br>Горячую воду отключают ' + jsonData[i].start + '</div>';
                singleMarker = new google.maps.Marker({
                    position: givenAddressLatLng,
                    map: map,
                    icon: singleMarkerIcon,
                    infowindow: new google.maps.InfoWindow({
                        content: address
                        })
                    });
                google.maps.event.addListener(singleMarker, 'click', function() {
                        this.infowindow.open(map, this);
                    });
                }
            };
        if (checker == false) {
            alert("По адресу " + givenAddress + " в ближайший месяц отключения не ожидается.");
        };
    }
}

window.onload = function() {
    insertMap();
    var request = new XMLHttpRequest();
    request.onreadystatechange = function(){
        if (request.readyState === 4) {
            data = request.responseText;
            jsonData = JSON.parse(data);
            selectData("uzhe_otkliuchili")
            setMenuEvents();
            selectAddress();
        }
    };
    request.open("GET", "data/data.json", true);
    request.send(null);
};
