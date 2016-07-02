<?php
	header("Access-Control-Allow-Origin: *");
?>
<!DOCTYPE HTML>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="График отключения горячей воды в Минске. График капитального ремонта жилых домов в Минске.">
        <title>График отключения горячей воды в Минске в 2016 году</title>
        <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBRz0gGX_Qz0f8LIFna6DNSOwOrN7zontE&sensor=false"></script>
        <script src="js/markerclusterer_compiled.js"></script>
        <link rel="stylesheet" href="http://code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css">
        <script src="http://code.jquery.com/jquery-2.1.4.min.js"></script>
        <script src="http://code.jquery.com/ui/1.11.4/jquery-ui.min.js"></script>
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
         <a href="/"><img src="img/logo.jpg" /></a>
         <a href="http://vk.com/opendataby"><img id="vk" src="img/vk32.png" /></a>
    </header>
    <main>
    <h1>14 дней без горячей воды<sup>май-июль 2016</sup></h1>
        <p>Каждый год в Минске с конца весны и до начала осени проводятся испытания тепловых сетей перед отопительным сезоном. Поэтому городские службы последовательно отключают горячее водоснабжение потребителям на срок, как правило, не более 14 суток.</p>
        <p>В 2016 году отключения горячей воды в Минске начались 11 мая. Это информационное приложение позволяет узнать, где и как долго в городе уже нет горячей воды, где только планируют отключать и где уже должны были включить.</p>
        <h2>Узнать дату отключения по адресу</h2>
        <input id="autocomplete" value="Введите адрес">
        <input class="button" type="button" id="show_data" value="Узнать">
        <div id="data_show"></div>
        <p id="message"></p>
    <div id="menu">
        <input class="button" type="button" id="uzhe_otkliuchili" value="Уже отключили">
        <input class="button" type="button" id="skoro_otkliuchat" value="Скоро отключат">
        <input class="button" type="button" id="dolzhny_vkliuchit" value="Должны включить">
    </div>
    <div id="mapDiv" class="map"></div>
        <p>Во время испытаний возможны повреждения теплопровода. При обнаружении течи воды или парения из земли, колодцев, провалов грунта необходимо срочно сообщить об этом диспетчеру УП «Минсккоммунтеплосеть» по тел. <strong>267-88-88</strong>, или диспетчеру филиала «Минские тепловые сети» по тел. <strong>298 27 27</strong>, <strong>298 27 37</strong>, или диспетчеру ЦДС РУП «Минскэнерго» по тел. <strong>227 35 24</strong> или в ближайший ГДУП «ЖЭУ, ЖЭС».</p>
        <p>Приложение работает на основе <a href="http://minsk.gov.by/ru/actual/view/625/">данных Мингорисполкома</a>, которые проверены нами с помощью специалистов УП "Минсккоммунтеплосеть" и преобразованы в машиночитаемый вид.</p>
        <h2>График капитального ремонта жилых домов в Минске</h2>
        <input id="remont" value="Введите адрес">
        <input type="button" class="button" id="remont_button" value="Узнать">
        <div id="remont_table"></div>
        <p><strong>Упоминания в СМИ:</strong></p>
        <ul>
        <li>Компьютерные Вести, <a href="http://www.kv.by/content/335283-proekt-datashkola-predstavlyaet-informatsionnoe-prilozhenie-14-dnei-bez-goryachei-vod">http://www.kv.by/content/335283...</a></li>
        <li>Телеграф, <a href="http://telegraf.by/2015/05/290076-minchane-sozdali-prilojenie-14-dnei-bez-goryachei-vodi">http://telegraf.by/2015/05/290076...</a></li>
        <li>Хартия97, <a href="http://charter97.org/ru/news/2015/5/5/150281/">http://charter97.org/ru/news/2015/5/5/150281/</a></li>
        <li>Как Тут Жить, <a href="http://kaktutzhit.by/news/minsk-14-dnei">http://kaktutzhit.by/news/minsk-14-dnei</a></li>
        <li>Агентство социальных новостей, <a href="http://socnews.by/cites/2015/05/07/article_4622">http://socnews.by/cites/2015/05/07/...</a></li>
        <li>Новы Час, <a href="http://novychas.info/hramadstva/mincanie_stvaryli_interaktyuny/">http://novychas.info/hramadstva/mincanie...</a></li>
		<li>Еўрарадыё, <a href="http://euroradio.by/shto-robyac-kamunalshchyki-pakul-adklyuchanaya-garachaya-vada">http://euroradio.by/shto-robyac-kamunalshchyki...</a></li>
		<li>Комсомольская правда, <a href="http://www.kp.by/daily/26535.5/3552619/">http://www.kp.by/daily/26535.5/3552619</a></li>


        </ul>
        <p><strong>Прочее:</strong>
        <ul>
        <li>Репозиторий приложения: <a href="https://github.com/ushchent/bezVody/">github.com/ushchent/bezVody</a></li>
        <li>Другие проекты сообщества "Открытые данные для Беларуси": <a href="http://opendata.by/projects/">opendata.by/projects</a></li>
        <li>Контакты сообщества для желающих присоединиться: <a href="http://opendata.by/about/">opendata.by/about</a></li>
        </ul>
        <p>Редактор приложения Алексей Медвецкий, am@opendata.by.</p>
    </main>
    <footer>
	<p>Сделано в dataШколе сообщества "<a href="http://opendata.by">Открытые данные для Беларуси</a>".</p>
    <script src="js/script.js"></script>
    </footer>
</body>
</html>
