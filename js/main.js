// Передавать days_left в основном index.html.

var data, remont_data, today = new Date();

var message = document.getElementById("message");

var addressField = document.getElementById("autocomplete");
addressField.onfocus = function() {
        if (addressField.value == "Вводите адрес и выбирайте из списка") {
            addressField.value = "";
        }
    }
addressField.onblur = function() {
        if (addressField.value == "") {
            addressField.value = "Вводите адрес и выбирайте из списка";
        }
   };

document.getElementById("svodka").appendChild(document.createTextNode(convertDate(today)));

// Обработка даты в сообщении о дате отключения воды
function parse_start_date(start) {
	var months = {
		"04": "апреля",
		"05": "мая",
		"06": "июня",
		"07": "июля",
		"08": "августа",
		"09": "сентября"
	};
	var month = start.slice(5,7);
	var day = (start.slice(8,10)[0] == 0 ? start.slice(8,10)[1] : start.slice(8,10));
	var readable_date = day + " " + months[month];
	return readable_date;
}

// Определяем дату отключения и выводим сообщение.
document.getElementById("show_data").onclick = function() {

if (document.getElementById("autocomplete").value == "Вводите адрес и выбирайте из списка" || data == undefined) {
	message.innerHTML = "Пожалуйста, введите адрес.";
} else if (data.length > 0) {
	
		var address_selected = document.getElementById("autocomplete").value;

		for (var i = 0; i < data.length; i++) {
			if (data[i].address == address_selected) {
				var start = data[i].start;
				if (data[i].fio_uchmil != "") {
					var uch_mil = data[i].fio_uchmil;
				}
				break;
			};
		};
		// Если введенный адрес нашелся в выпавшем списке и есть дата
		start ? message.innerHTML = "Горячую воду отключают " + parse_start_date(start) + "." + (uch_mil ? "<br>Ваш участковый милиционер " + uch_mil + ".<br>Больше информации по вашему дому &ndash; в проекте " + '<a href="http://doma.opendata.by">Я дома</a>.' : "") : 
			message.innerHTML = "<p>В ближайшие " + days_left + " дней отключения горячей воды по указанному адресу не ожидается. Пожалуйста, обратитесь позже.";
		// Скрываем список
		document.getElementById("data_show").className = "hidden";

		//message.innerHTML = "Горячую воду отключают " + parse_start_date(start) + ".";		
} else if (data.length == 0) {
			var message_body = "<p>В ближайшие " + days_left + " дней отключения горячей воды по указанному адресу не ожидается. Пожалуйста, обратитесь позже.";
			 message.innerHTML = message_body;
} 

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

function get_address(str) {

	var target = document.getElementById("data_show");
	message.innerHTML = "";
	
	if (str.length <= 4 || str == "Вводите адрес и выбирайте из списка") {
	
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
          request.open("GET", "http://api.nagrady.by/bezvody/?q=" + str, true);
          request.send();
        }
}



document.getElementById("blue").innerHTML = nominativ(document.getElementById("uzhe_otkliuchili").value) + " уже отключили,";
