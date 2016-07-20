var map,
    singleMarker,
    icon,
    markerclusterer,
    timeSpan = 86400000 * 14,
    today = new Date(),
    remontData,
    request;









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
document.getElementById("svodka").appendChild(
	document.createTextNode(convertDate(d)
		+ " без горячей воды остаются "
		+ noWater.length
		+ " "
		+ nominativ(noWater.length.toString())
		+ ", скоро отключат в "
		+ soonNoWater.length
		+ " "
		+ dativ(noWater.length.toString())
		+ " и уже должна быть вода в "
		+ isWater.length
		+ " "
		+ dativ(isWater.length.toString())
		+ ":")
	); 
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



    insertMap();
    if (window.XMLHttpRequest) {
        request = new XMLHttpRequest();
    } else {  
        request = new ActiveXObject("Microsoft.XMLHTTP");
    }
    request.onreadystatechange = function(){
        if (request.readyState === 4 && request.status == 200) {
            jsonData = JSON.parse(request.responseText);
            writeMessage(today);
            selectData("uzhe_otkliuchili")
            setMenuEvents();

        }
    };
    request.open("GET", "data/data.json", true);
    request.send(null);


//window.onload = function() {
    
//var itemField = document.getElementById("remont");
    //itemField.onfocus = function() {
        //if (itemField.value == "Введите адрес") {
            //itemField.value = "";
        //}
    //}
    //itemField.onblur = function() {
        //if (itemField.value == "") {
            //itemField.value = "Введите адрес";
        //}
    //}
//var remont_addresses = [];





//var remontButton = document.getElementById("remont_button");


    //remontButton.onclick = function() {
//if (document.getElementById("remont_table").getElementsByTagName("p")[0]) {
            //document.getElementById("remont_table").removeChild(document.getElementById("remont_table").getElementsByTagName("p")[0]);
       //}
       
    ////var addressButton = document.getElementById("address_button");
    
    //var selectedAddress = document.getElementById("remont").value;


	     //var tableData = remontData.filter(function(d) { return d.adres == selectedAddress; });

//var target = document.getElementById("remont_table");

//if (tableData.length != 0) {
    
    //var paragraph = document.createElement("p");
    //var message = 'По адресу "' + selectedAddress + '" капитальный ремонт ожидается в ' + tableData[0].year + '.';

    //var text = document.createTextNode(message);
    //paragraph.appendChild(text);
    //target.appendChild(paragraph);    

 //} else {
     //var message = "<p>У нас пока нет данных о проведении капремонта по указанному адресу.<br>Пожалуйста, обратитесь в свое ЖЭУ.</p>";
     //target.innerHTML = message;
 //};
    //}

//};
