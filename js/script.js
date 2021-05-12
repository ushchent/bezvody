// Хосты для запуска продукта локально или в эфире
const hosts = {"local": "/api", "web": "https://api.opendata.by"};
const current_host = hosts["web"];

// Состояние программы в части загрузки данных для отображение на карте
const state = {
    "uzhe_otkliuchili": null,
    "skoro_otkliuchat": null,
    "dolzhny_vkliuchit": null,
    "zisterny": null,
    "data": null,
    "markers": null,
    "latest": null
};

// Управление текстом в строке ввода адреса
const address_field = document.getElementById("autocomplete");

address_field.onfocus = function() {
    if (address_field.value == "Вводите адрес и выбирайте из списка") {
        address_field.value = "";
    }
}
address_field.onblur = function() {
    if (address_field.value == "") {
        address_field.value = "Вводите адрес и выбирайте из списка";
    }
};

// Управление текстом надписи над 3-мя кнопками
const today = new Date();

function convertDate(d) {
    var months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
    var month = d.getMonth();
    var date = d.getDate();
    return date + " " + months[month];
}

document.getElementById("today").appendChild(document.createTextNode(convertDate(today)));

// Сбор общей статистики отключений для 3-х кнопок 
function get_stats() {
    fetch(`${current_host}/bezvody/?q=stats`)
        .then(response => response.json())
        .then(data => {
            document.getElementById("uzhe_otkliuchili").value = data[0];
            document.getElementById("skoro_otkliuchat").value = data[1];
            document.getElementById("dolzhny_vkliuchit").value = data[2];
            //document.getElementById("zisterny").value = data[3];
            state.latest = data[4];
            })
}

get_stats();

function create_result_list(data) {
    const target = document.getElementById("results_list");

    if (target.getElementsByTagName('ul')[0]) {
                    target.getElementsByTagName('ul')[0].remove();
    }
    var list = document.createElement("ul");

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
    bezvody_list_items_listeners("li", "results_list")
    document.getElementById("results_list")
        .style.border = "1px solid #A5ACB2";
}

// Забор списка адресов с датами отключения через поисковую строку
function get_address(str) {
    var target = document.getElementById("results_list");
    document.getElementById("message").innerHTML = "";
    
    if (str.length <= 4 || str == "Вводите адрес и выбирайте из списка") {
    
        target.className = "hidden";
    } else {
        fetch(`${current_host}/bezvody/?q=${str}`)
            .then(response => response.json())
            .then(data => {
                    state.data = data;
                    create_result_list(data)
                })
    }
}

const delta_in_days = (today, start) => Math.ceil((new Date(start) - today) / (86400000));

// Определяем дату отключения и выводим сообщение.
document.getElementById("show_data").onclick = function() {

    const message = document.getElementById("message");
    const { data } = state;

    if (document.getElementById("autocomplete").value == "Вводите адрес и выбирайте из списка") {
        message.innerHTML = "Пожалуйста, введите адрес.";

    } else if (data.length > 0) {
        var address_selected = document.getElementById("autocomplete").value;

// Переделать фрагмент на новый лад.

        for (var i = 0; i < data.length; i++) {
                if (data[i].address == address_selected) {
                    var start = data[i].start;
                    break;
                };
            };
            // Если введенный адрес нашелся в выпавшем списке и есть дата
            start ? message.innerHTML = "Горячую воду отключают " + parse_start_date(start) + "." : 
                message.innerHTML = "<p>В ближайшие " + delta_in_days(today, state.latest) + " дней отключения горячей воды по указанному адресу не ожидается. Пожалуйста, обратитесь позже.";
            // Скрываем список
            document.getElementById("results_list").className = "hidden";
    } else if (data.length == 0) {
                var message_body = "<p>В ближайшие " + delta_in_days(today, state.latest) + " дней отключения горячей воды по указанному адресу не ожидается. Пожалуйста, обратитесь позже.";
                 message.innerHTML = message_body;
    }

}

function bezvody_list_items_listeners(item, place_holder) {
    var place = document.getElementById(place_holder);
    var items = place.getElementsByTagName(item);
    for (let i = 0; i < items.length; i++) {
        items[i].addEventListener("click", function() {
            const selected = this.textContent;
            document.getElementById("autocomplete").value = selected;
            document.getElementById("results_list").className = "hidden";
        });
    }
}

document.getElementById("blue").innerHTML = nominativ(document.getElementById("uzhe_otkliuchili").value) + " уже отключили,";

// Управление 3-мя кнопками и картой

function set_menu_events() {
    const buttons = document.getElementsByClassName("menu")[0].getElementsByClassName("button");
    
    Object.values(buttons).forEach(b => {
        b.onclick = function() {
            load_data_by_id(this.getAttribute("id"));
        }
   })
}

function load_data_by_id(id) {
    if (state[id] === null) {
        fetch(`${current_host}/bezvody/?q=${id}`)
            .then(response => response.json())
            .then(data => {
                state[id] = data;
                manage_markers(data, id);
                //const days_margin = data.map(d => new Date(d.start)).sort((a, b) => a - b)[data.length - 1];
                //days_left = Math.floor((days_margin - new Date()) / (1000*86400));
            });
    } else {
        manage_markers(state[id], id);
    }
}

set_menu_events();

// Карта
const map_icon = L.icon({
  iconUrl: 'img/icon.png',
  iconSize: [29, 24],
  iconAnchor: [9, 21],
  popupAnchor: [0, -14]
});

const mymap = L.map('mapid', {
                minZoom: 11,
                maxZoom: 15
                })
                .setView([53.893009, 27.567444], 12);

L.tileLayer('https://api.opendata.by/tiles/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);


function add_markers(data) {
    data.forEach(d => {
        let popup = d.address + '<br/>' + ( d.start ? d.start : "") ;
        let marker = L.marker([d.lat, d.lon], {icon: map_icon})
                .bindPopup(popup);
        state.markers.addLayer(marker);
    })
    mymap.addLayer(state.markers);
}

function create_marker_cluster_group(id) {
    state.markers = L.markerClusterGroup({
        showCoverageOnHover: false,
        iconCreateFunction: function(cluster) {
        const class_name = id + " marker-cluster";
        return L.divIcon({ html: "<div><span>" + cluster.getChildCount() + "</span></div>",
            className: class_name });
        }
    });
}

// Добавляем маркеры
function manage_markers(data, id) {
    if (state.markers) {
        state.markers.clearLayers();
        create_marker_cluster_group(id);
        add_markers(data);
    } else {
        create_marker_cluster_group(id);
        add_markers(data);
    }
}

////////////////////////////////////
//// Обработка падежей
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

//// Обработка даты в сообщении о дате отключения воды
function parse_start_date(date_string) {
    const months = {
        3: "апреля",
        4: "мая",
        5: "июня",
        6: "июля",
        7: "августа",
        8: "сентября"
    };

    const date = new Date(date_string);
    const month = date.getMonth();
    const day = date.getDate();

    const readable_date = day + " " + months[month];

    return readable_date;
}

load_data_by_id("uzhe_otkliuchili");
