var data, map, markerclusterer;

function insertMap() {
    var mapParameters = {
        center: new google.maps.LatLng(53.90, 27.56),
        zoom: 11,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("mapDiv"), mapParameters);
}

function parse_date(date) {
	var months = {
		"05": "мая",
		"06": "июня",
		"07": "июля",
		"08": "августа",
		"09": "сентября"
		};
	var month = date.slice(5, 7);
	var day = date.slice(8, 10);
	return day + " " + months[month];
}

function addMarkers(data) {
    var markers = [];
    for (var i = 0; i < data.length; i++) {
            var coordinates = new google.maps.LatLng(data[i].lat, data[i].lon);
            var address = '<div style="width: 200px, height: 100px;"><b>Адрес:</b> ' +
                data[i].address +
                '<br>Горячую воду отключают ' + data[i].start + '</div>';
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
            url: "img/blue.png",
            width: 53
                }]
            };

    markerclusterer = new MarkerClusterer(map, markers, mcOptions);
}

function create_menu() {
	var target = document.getElementById("calendar");
	var table = document.createElement("table");
	target.appendChild(table);

	var thead = document.createElement("thead");
	var thead_row = document.createElement("tr");

	var first_th_text = document.createTextNode("Когда");
	var first_th = document.createElement("th");
	first_th.appendChild(first_th_text);
	
	var second_th_text = document.createTextNode("Домов");
	var second_th = document.createElement("th");
	second_th.appendChild(second_th_text);

	thead_row.appendChild(first_th);
	thead_row.appendChild(second_th);
	thead.appendChild(thead_row);
	table.appendChild(thead);

	var tbody = document.createElement("tbody");
	
	dates.forEach(function(d) {
		var tbody_row = document.createElement("tr");

		var first_cell_text = document.createTextNode(parse_date(d.start));
		var first_td = document.createElement("td");
		first_td.classList.add("date")
		first_td.appendChild(first_cell_text);

		var date_id = document.createAttribute("id");
		date_id.value = d.start; 
		first_td.setAttributeNode(date_id); 

		var second_cell_text = document.createTextNode(d.count);
		var second_td = document.createElement("td");
		second_td.appendChild(second_cell_text);

		tbody_row.appendChild(first_td);
		tbody_row.appendChild(second_td);
		
		tbody.appendChild(tbody_row);
	})
	table.appendChild(tbody);
}

function setMenuEvents() {
    var date_list = document.getElementsByClassName("date");
    for (var i = 0; i < date_list.length; i++) {
        date_list[i].onclick = function() {
            markerclusterer.clearMarkers();
            if (!map.setZoom(11)) {
                    map.setZoom(11);
                    map.setCenter(new google.maps.LatLng(53.90, 27.56));
                };
            var tds = document.getElementsByClassName("date");
            for (var i = 0; i < tds.length; i++) {
				tds[i].classList.remove("active");
			}
            selectData(this.getAttribute("id"));
            this.classList.add("active")
        }
    }
}

function selectData(date) {
	request.onreadystatechange = function() {
		if (request.readyState === 4 && request.status == 200) {
			var data = JSON.parse(request.responseText);
			addMarkers(data);
			}
		}
	request.open("GET", "api/?d=" + date, true);
	request.send(null);
}

window.onload = function() {
	if (window.XMLHttpRequest) {
		request = new XMLHttpRequest();
	} else {  
		request = new ActiveXObject("Microsoft.XMLHTTP");
	}
	insertMap();
	create_menu();
	document.getElementsByClassName("date")[0].classList.add("active");
	setMenuEvents();
	selectData(dates[0]["start"]); // Передаем первую дату из серверного списка.
}
