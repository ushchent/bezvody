var map,
    singleMarker,
    icon,
    markerclusterer,
    days_left;

function insertMap() {
    var mapParameters = {
        center: new google.maps.LatLng(53.90, 27.56),
        zoom: 11,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("mapDiv"), mapParameters);

}

function nominativ(s) {
	var n = parseInt(s.charAt(s.length - 1));
	if (n == 1) {
		return "дом";
	} else if (n > 1 && n < 5) {
		return "дома";
	} else {
	return "домов";
	}
}

function dativ(s) {
	var n = parseInt(s.charAt(s.length - 1));
	if (n == 1) {
		return "доме";
	} else if (n > 1) {
		return "домах";
	} else {
	return "домах";
	}
}

function addMarkers(indata, input, icon) {
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

function setMenuEvents() {
    var buttons = document.getElementsByClassName("menu")[0].getElementsByClassName("button");
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
	if (input == "uzhe_otkliuchili") {
		icon = "img/blue.png";
    } else if (input == "skoro_otkliuchat") {
		icon = "img/yellow.png";
    } else if (input == "dolzhny_vkliuchit") {
        icon = "img/red.png";
    }

	request.onreadystatechange = function() {
		if (request.readyState === 4 && request.status == 200) {
			data = JSON.parse(request.responseText);
			addMarkers(data, input, icon);
			document.getElementById("skoro_otkliuchat").value = data.length;
			const days_margin = data.map(d => new Date(d.start)).sort((a, b) => a - b)[data.length - 1];
			days_left = Math.floor((days_margin - new Date()) / (1000*86400));
			}
		}
	request.open("GET", "http://api.nagrady.by/bezvody/?q=" + input, true);
	request.send(null);
}



window.onload = function() {
	if (window.XMLHttpRequest) {
		request = new XMLHttpRequest();
	} else {  
		request = new ActiveXObject("Microsoft.XMLHTTP");
	}
	insertMap();
	setMenuEvents();
	selectData("skoro_otkliuchat");
}
