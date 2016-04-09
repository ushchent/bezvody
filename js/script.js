var map,
    singleMarker,
    jsonData,
    icon,
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
    addMarkers(newData, input, icon);
}

function convertDate(d) {
    var months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
    var month = d.getMonth();
    var date = d.getDate();
    return date + " " + months[month];
}

function writeMessage(d) {
    var noWater = [], isWater = [], soonNoWater = [];
    for (var i = 0; i < jsonData.length; i++) {
        var startDate = new Date(jsonData[i].start);
            if (startDate.getTime() <= d.getTime() && startDate.getTime() >= d.getTime() - timeSpan) {
                noWater.push(jsonData[i]);
            } else if (startDate.getTime() > d.getTime()) {
                soonNoWater.push(jsonData[i]);
            } else if (startDate.getTime() < d.getTime() - timeSpan) {
                isWater.push(jsonData[i]);
            }
        }
document.getElementById("message").appendChild(document.createTextNode(convertDate(d) + " уже должна быть вода в " + isWater.length + " домах, без горячей воды остаются " + noWater.length + " домов,  и скоро отключат в " + soonNoWater.length + " домах:"));
}

function addMarkers(indata, input) {
    var markers = [];
    for (var i = 0; i < indata.length; i++) {
            var coordinates = new google.maps.LatLng(indata[i].lat, indata[i].lon);
            var address = '<div style="width: 200px, height: 100px;"><b>Адрес:</b> ' +
                indata[i].address +
                '<br>Горячую воду отключают ' + indata[i].start + '</div>';
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
}

function selectAddress() {
    var addresses = [];
    for (var i = 0; i < jsonData.length; i++) {
        addresses.push(jsonData[i].address);
    };;

    $( "#autocomplete" ).autocomplete({
        source: addresses,
        minLength: 4
    });

    var addressField = document.getElementById("autocomplete");
    addressField.onfocus = function() {
        if (addressField.value == "Проверить адрес") {
            addressField.value = "";
        }
    }
    addressField.onblur = function() {
        if (addressField.value == "") {
            addressField.value = "Проверить адрес";
        }
    }

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
            alert("По адресу " + givenAddress + " в ближайшее время отключения не ожидается. Вы также можете проверить этот адрес в первоисточнике http://minsk.gov.by/ru/actual/view/585/.");
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
            writeMessage(today);
            selectData("skoro_otkliuchat")
            setMenuEvents();
            selectAddress();
        }
    };
    request.open("GET", "data/data.json", true);
    request.send(null);
};
