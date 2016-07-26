<?php
	$today_base_string = date("Y-m-d");
	$db = new SQLite3("data/bezvody.sqlite");
	
	$sql_remont = "select count(*) as count from remont;";
	$remont = $db->query($sql_remont)->fetchArray(SQLITE3_ASSOC)["count"];

    $nearest_date_string = $db->query("select max(start) as max from data_all;")->fetchArray(SQLITE3_ASSOC)['max'];

    $today_base_date = new DateTime($today_base_string);
    $nearest_date = new DateTime($nearest_date_string);

	$days_till_margin = $today_base_date->diff($nearest_date)->days;
	$margin_date = $today_base_date->modify('-14 days');
	$margin_data_string = $margin_date->format("Y-m-d");
		
	$sql_netvody = "select count(*) as count from data_all where start between '$margin_data_string' and '$today_base_string';";
	$netvody = $db->query($sql_netvody)->fetchArray(SQLITE3_ASSOC)["count"];

	$sql_skoronet = "select count(*) as count from data_all where start > '$today_base_string';";
	$skoronet = $db->query($sql_skoronet)->fetchArray(SQLITE3_ASSOC)["count"];

	$sql_jestvoda = "select count(*) as count from data_all where start < '$margin_data_string';";
	$jestvoda = $db->query($sql_jestvoda)->fetchArray(SQLITE3_ASSOC)["count"];
?>

<!DOCTYPE HTML>
<html lang="ru">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta name="description" content="Здесь можно узнать, когда и где отключают горячую воду в Минске летом, а также где ожидается капитальный ремонт.">
        <title>График отключения горячей воды в Минске в 2016 году</title>
        <link rel="stylesheet" href="css/styles.css">
<!-- Yandex.Metrika counter -->
<script type="text/javascript">
	if (document.location.hostname != "localhost") {
    (function (d, w, c) {
        (w[c] = w[c] || []).push(function() {
            try {
                w.yaCounter36789295 = new Ya.Metrika({
                    id:36789295,
                    clickmap:true,
                    trackLinks:true,
                    accurateTrackBounce:true,
                    webvisor:true
                });
            } catch(e) { }
        });

        var n = d.getElementsByTagName("script")[0],
            s = d.createElement("script"),
            f = function () { n.parentNode.insertBefore(s, n); };
        s.type = "text/javascript";
        s.async = true;
        s.src = "https://mc.yandex.ru/metrika/watch.js";

        if (w.opera == "[object Opera]") {
            d.addEventListener("DOMContentLoaded", f, false);
        } else { f(); }
    })(document, window, "yandex_metrika_callbacks");
} else {
	console.log("You're on localhost.");
}
</script>
<noscript><div><img src="https://mc.yandex.ru/watch/36789295" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
<!-- /Yandex.Metrika counter -->
    </head>
<body>
    <header>
         <a href="/"><img id="logo" src="img/logo.jpg" /></a>
         <a href="http://vk.com/opendataby"><img id="vk" src="img/vk32.png" /></a>
    </header>
    <main>
	<script> var days_left = <?php echo $days_till_margin; ?>;</script>
    <h1>14 дней без горячей воды<sup>май-август 2016</sup></h1>
        <p>Каждый год в Минске с конца весны и до начала осени проводятся испытания тепловых сетей перед отопительным сезоном. Поэтому городские службы последовательно отключают горячее водоснабжение потребителям на срок, как правило, не более 14 суток.</p>
        <p>В 2016 году отключения горячей воды начались 11 мая. Здесь можно узнать, где и как долго в городе уже нет горячей воды, где только планируют отключать и где уже должны были включить.</p>     
		 <div id="ad">
		<p id="caption">Реклама</p>
		<p id="text">Компания "НетосТех" поможет вам с комфортом пережить отключение горячей воды.<br>Возьмите <strong>водонагреватель в аренду</strong> на две недели. Подробности на сайте <a href="http://epro.by/leto">epro.by/leto</a> и по телефону мтс/velcom <a href="tel:6698671">669 86 71</a>.</p>
		</div>
        <h2>Узнать дату отключения по адресу</h2>
        <input id="autocomplete" value="Введите адрес" onkeyup="get_address(this.value)">
        <input class="button" type="button" id="show_data" value="Узнать">
        <div id="data_show" class="hidden"></div>
        <p id="message"></p>
        <h2>Карта отключений горячей воды на <span id="svodka"></span></h2>
        <div id="menu">
        <div class="buttonGroup"><input class="button" type="button" id="uzhe_otkliuchili" value="<?php echo $netvody; ?>">
        <p>дома уже отключили,</p>
        </div>
        <div class="buttonGroup">
        <input class="button" type="button" id="skoro_otkliuchat" value="<?php echo $skoronet; ?>">
        <p>скоро отключат и</p>
        </div>
        <div class="buttonGroup">
        <input class="button" type="button" id="dolzhny_vkliuchit" value="<?php echo $jestvoda; ?>">
        <p>уже должны подключить.</p>
		</div>
    </div>
    <div id="mapDiv" class="map"></div>
    <div id="warning">
        <p>Во время испытаний возможны повреждения теплопровода. При обнаружении течи воды или парения из земли, колодцев, провалов грунта необходимо срочно сообщить об этом диспетчеру УП «Минсккоммунтеплосеть» по тел. <strong>267-88-88</strong>, или диспетчеру филиала «Минские тепловые сети» по тел. <strong>298 27 27</strong>, <strong>298 27 37</strong>, или диспетчеру ЦДС РУП «Минскэнерго» по тел. <strong>227 35 24</strong> или в ближайший ГДУП «ЖЭУ, ЖЭС».</p>
        </div>
		<h2>График капитального ремонта жилых домов в Минске в 2016 году<sup><?php echo $remont . " домов"; ?></sup></h2>
        <input id="remont" onkeyup="get_remont(this.value)" value="Введите адрес">
        <input type="button" id="buttonRemont" value="Узнать">
        <div id="remontMessage" class="hidden"></div>
        <p id="remontResponse"></p>
<div id="info">
        <p><strong>Упоминания в СМИ:</strong></p>
        <ul>
        <li>Компьютерные Вести, <a href="http://www.kv.by/content/335283-proekt-datashkola-predstavlyaet-informatsionnoe-prilozhenie-14-dnei-bez-goryachei-vod">http://www.kv.by/content/335283...</a></li>
        <li>Телеграф, <a href="http://telegraf.by/2015/05/290076-minchane-sozdali-prilojenie-14-dnei-bez-goryachei-vodi">http://telegraf.by/2015/05/290076...</a></li>
        <li>Хартия97, <a href="http://charter97.org/ru/news/2015/5/5/150281/">http://charter97.org/ru/news/2015/5/5/150281/</a></li>
        <li>Как Тут Жить, <a href="http://kaktutzhit.by/news/minsk-14-dnei">http://kaktutzhit.by/news/minsk-14-dnei</a></li>
        <li>Агентство социальных новостей, <a href="http://socnews.by/cites/2015/05/07/article_4622">http://socnews.by/cites/2015/05/07/...</a></li>
        <li>Новы Час, <a href="http://novychas.info/hramadstva/mincanie_stvaryli_interaktyuny/">http://novychas.info/hramadstva/mincanie...</a></li>
        <li>Sputnik Беларусь, <a href="http://sputnik.by/technology/20150605/1015580135.html">http://sputnik.by/technology/20150605/...</a></li>
		<li>Еўрарадыё, <a href="http://euroradio.by/shto-robyac-kamunalshchyki-pakul-adklyuchanaya-garachaya-vada">http://euroradio.by/shto-robyac-kamunalshchyki...</a></li>
		<li>Комсомольская правда, <a href="http://www.kp.by/daily/26535.5/3552619/">http://www.kp.by/daily/26535.5/3552619</a></li>
        </ul>
        <p><strong>Прочее:</strong>
        <ul>
        <li>Источник данных: Мингорисполком, <a href="http://minsk.gov.by/ru/actual/view/625/">http://minsk.gov.by/ru/actual/view/625/</a></li>
        <li>Репозиторий приложения: <a href="https://github.com/ushchent/bezVody/">github.com/ushchent/bezVody</a></li>
        <li>Другие проекты сообщества "Открытые данные для Беларуси": <a href="http://opendata.by/projects/">opendata.by/projects</a></li>
        <li>Контакты сообщества для желающих присоединиться: <a href="http://opendata.by/about/">opendata.by/about</a></li>
        <li>Редактор приложения Алексей Медвецкий, am@opendata.by.</li>
        </ul>
</div>
    </main>
    <footer>
	<p>Сделано в dataШколе сообщества "<a href="http://opendata.by">Открытые данные для Беларуси</a>".</p>
	<script src="js/main.js"></script>
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBRz0gGX_Qz0f8LIFna6DNSOwOrN7zontE"></script>
    <script src="js/markerclusterer_compiled.js"></script>
    <script src="js/script.js"></script>
    </footer>
</body>
</html>
