<?php
	$today_base_string = date("Y-m-d");
    $today_base_date = new DateTime($today_base_string);
	$margin_date = $today_base_date->modify('-14 days');
	$margin_data_string = $margin_date->format("Y-m-d");

	function return_json($sql, $db) {
		$result = $db->query($sql);
		$json_data = [];
		while($row = $result->fetchArray(SQLITE3_ASSOC)) {
			array_push($json_data, $row);
		};
		return json_encode($json_data);
		$db->close();	
	};

	$db = new SQLite3('../data/bezvody.sqlite');

	if (isset($_GET['q'])) {
		$query = (string)trim($_GET['q']);

		if ($query == "uzhe_otkliuchili") {
			$sql = "select * from data_all where start between '$margin_data_string' and '$today_base_string';";
			echo return_json($sql, $db);
		} else if ($query == "skoro_otkliuchat") {
			$sql = "select * from data_all where start > '$today_base_string';";
			echo return_json($sql, $db);
		} else if ($query == "dolzhny_vkliuchit") {
			$sql = "select * from data_all where start < '$margin_data_string';";
			echo return_json($sql, $db);
		} else if (strlen($query) > 4) {
			$stripped_query = mb_substr($query, 1, strlen($query));
			$sql = "select address, start from data_all where address like '%{$stripped_query}%';";
			echo return_json($sql, $db);
		} else {
			echo "[]";
		}
	} else if (isset($_GET['r'])) {
		$query = (string)trim($_GET['r']);
		
		if (strlen($query) > 4) {
			$stripped_query = mb_substr($query, 1, strlen($query));
			$sql = "select address, start from data_all where address like '%{$stripped_query}%';";
			echo return_json($sql, $db);
		} else {
			echo "[]";
		}
		
		
		
	} else {
		echo "[]";
	}
?>

