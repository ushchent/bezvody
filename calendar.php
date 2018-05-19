<?php
$sql_dates = 'SELECT start, count(start) as count from data_all where start > "2017-06-15" group by start;';

$db = new SQLite3('data/bezvody.sqlite');
$dates = $db->query($sql_dates);

$json_data = [];
while($row = $dates->fetchArray(SQLITE3_ASSOC)) {
			array_push($json_data, $row);
		};
$sql_tsg = "SELECT count(*) as count, ts FROM tsg group by ts order by count desc;";
$tsg = $db->query($sql_tsg);


?>
<!doctype html>
<html>
<head>
	<meta charset='utf-8'>
	<meta name='description' content=''>
	<meta name='viewport' content='width=device-width, initial-scale=1'>
	<link rel="stylesheet" type="text/css" href="css/calendar.css">
	<title>Календарь отключений горячей воды</title>
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
	</header>
	<main>
    <script>
        var dates = <?php echo json_encode($json_data); ?>;
    </script>
	<h1>Календарь отключений горячей воды</h1>
	<p>На карту выводятся группы домов, в которых планируется отключать воду на указанную дату.</p>
    <div id="calendar">
	</div>
	<div id="mapDiv" class="map">
	</div>
	<div id="tsj">
	<h2>Товарищества собственников жилья <sup>beta</sup></h2>
	</div>
	<div id="tsg">
	<table>
		<tr><th>ТСЖ</th><th>Подчиненных домов</th><th>Отключают воду</th></tr>
	<?php
		while($row = $tsg->fetchArray(SQLITE3_ASSOC)) {
			echo "<tr><td>{$row['ts']}</td><td>{$row['count']}</td><td>Пока нет данных</td></tr>";
		};
?>
	

	</table>
	</div>
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBRz0gGX_Qz0f8LIFna6DNSOwOrN7zontE"></script>
    <script src="js/markerclusterer_compiled.js"></script>
    <script src="js/calendar.js"></script>
	</main>
	<footer>
	</footer>
</body>
</html>
