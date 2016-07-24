var data;

var message = document.getElementById("message");
// Сначала только функции, которые используются в поиске адреса.
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

// Определяем дату отключения и выводим сообщение.
document.getElementById("show_data").onclick = function() {

if (document.getElementById("autocomplete").value == "Введите адрес." || data == undefined) {
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

function list_items_listeners(item) {
	var items = document.getElementsByTagName(item);
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
			  list_items_listeners("li")
              document.getElementById("data_show").style.border = "1px solid #A5ACB2";
            }
          }
          request.open("GET","api/?q=" + str, true);
          request.send();
        }
}
