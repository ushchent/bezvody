var data, remont_data, today = new Date();

var message = document.getElementById("message");
var message_remont = document.getElementById("remontResponse");

var addressField = document.getElementById("autocomplete");
addressField.onfocus = function() {
        if (addressField.value == "Введите адрес") {
            addressField.value = "";
        }
    }
addressField.onblur = function() {
        if (addressField.value == "") {
            addressField.value = "Введите адрес";
        }
   };

var remontField = document.getElementById("remont");
remontField.onfocus = function() {
        if (remontField.value == "Введите адрес") {
            remontField.value = "";
        }
    }
remontField.onblur = function() {
        if (remontField.value == "") {
            remontField.value = "Введите адрес";
        }
    };

document.getElementById("svodka").appendChild(document.createTextNode(convertDate(today)));


// Определяем дату отключения и выводим сообщение.
document.getElementById("show_data").onclick = function() {

if (document.getElementById("autocomplete").value == "Введите адрес" || data == undefined) {
	message.innerHTML = "Пожалуйста, введите адрес.";
} else if (data.length > 0) {
	
		var address_selected = document.getElementById("autocomplete").value;

		for (var i = 0; i < data.length; i++) {
			if (data[i].address == address_selected) {
				var start = data[i].start;
				break;
			};
		};

		message.innerHTML = "По адресу '" + address_selected + "' горячую воду отключают " + start + ".";		
} else if (data.length == 0) {
			var message_body = "<p>В ближайшие " + days_left + " дней отключения горячей воды по указанному адресу не ожидается. Пожалуйста, обратитесь позже.";
			 message.innerHTML = message_body;
} 

}

document.getElementById("buttonRemont").onclick = function() {

if (document.getElementById("remont").value == "Введите адрес" || remont_data == undefined) {
	message_remont.innerHTML = "Пожалуйста, введите адрес.";
} else if (remont_data.length > 0) {
	
		var address_selected = document.getElementById("remont").value;

		for (var i = 0; i < remont_data.length; i++) {
			if (remont_data[i].address == address_selected) {
				var address_found = remont_data[i].address;
				break;
			};
		};
		
		message_remont.innerHTML = "По адресу '" + address_found + "' капитальный ремонт ожидается в 2016 году.";		
} else if (remont_data.length == 0) {
			var message_body = "<p>В текущем году капитальный ремонт по указанному адресу не ожидается.";
			 message_remont.innerHTML = message_body;
}
}

function convertDate(d) {
    var months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
    var month = d.getMonth();
    var date = d.getDate();
    return date + " " + months[month];
}

function bezvody_list_items_listeners(item, place_holder) {
	var place = document.getElementById(place_holder);
	var items = place.getElementsByTagName(item);
	for (var i = 0; i < items.length; i++) {
		items[i].addEventListener("click", function() {
			var selected = this.textContent;
			document.getElementById("autocomplete").value = selected;
			document.getElementById("data_show").className = "hidden";
		});
	}
}

function remont_list_items_listeners(item, place_holder) {
	var place = document.getElementById(place_holder);
	var items = place.getElementsByTagName(item);
	for (var i = 0; i < items.length; i++) {
		items[i].addEventListener("click", function() {
			var selected = this.textContent;
			document.getElementById("remont").value = selected;
			document.getElementById("remontMessage").className = "hidden";
		});
	}
}

function get_address(str) {

	var target = document.getElementById("data_show");
	message.innerHTML = "";
	
	if (str.length <= 4 || str == "Введите адрес") {
	
		target.className = "hidden";
	}
          if (str.length > 4) {
          
          if (window.XMLHttpRequest) {

            var request = new XMLHttpRequest();
          } else {  
            var request = new ActiveXObject("Microsoft.XMLHTTP");
          }
          request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {

				if (target.getElementsByTagName('ul')[0]) {
					target.getElementsByTagName('ul')[0].remove();
				}
				var list = document.createElement("ul");

              data = JSON.parse(request.responseText);
              if (data.length == 0) {
				target.className = "hidden";
				} else {
					target.className = "";
				}
              for (var i = 0; i < data.length; i++) {
				  var address_text = document.createTextNode(data[i].address);
				  var list_item = document.createElement("li");
				  list_item.appendChild(address_text);
				  list.appendChild(list_item);
			  }
			  target.appendChild(list);
			  bezvody_list_items_listeners("li", "data_show")
              document.getElementById("data_show").style.border = "1px solid #A5ACB2";
            }
          }
          request.open("GET", "api/?q=" + str, true);
          request.send();
        }
}


function get_remont(str) {

	var remont_target = document.getElementById("remontMessage");
	message_remont.innerHTML = "";
	
	if (str.length <= 4 || str == "Введите адрес") {
	
		remont_target.className = "hidden";
	}
          if (str.length > 4) {
          
          if (window.XMLHttpRequest) {

            var request = new XMLHttpRequest();
          } else {  
            var request = new ActiveXObject("Microsoft.XMLHTTP");
          }
          request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {

				if (remont_target.getElementsByTagName('ul')[0]) {
					remont_target.getElementsByTagName('ul')[0].remove();
				}
				var list = document.createElement("ul");

              remont_data = JSON.parse(request.responseText);

              if (remont_data.length == 0) {
				remont_target.className = "hidden";
				} else {
					remont_target.className = "";
				}
              for (var i = 0; i < remont_data.length; i++) {
				  var address_text = document.createTextNode(remont_data[i].address);
				  var list_item = document.createElement("li");
				  list_item.appendChild(address_text);
				  list.appendChild(list_item);
			  }
			  remont_target.appendChild(list);
			  remont_list_items_listeners("li", "remontMessage")
              document.getElementById("remontMessage").style.border = "1px solid #A5ACB2";
            }
          }
          request.open("GET", "api/?r=" + str, true);
          request.send();
        }
}
