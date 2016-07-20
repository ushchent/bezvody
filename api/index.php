<?php
	if (isset($_GET['q'])) {
		$query = trim($_GET['q']);
		if (strlen($query) > 0) {
			$stripped_query = mb_substr($query, 1, strlen($query));
			$db = new SQLite3('../data/bezvody.sqlite');
			$sql = "select address, start from data where address like '%{$stripped_query}%';";
			$result = $db->query($sql);
			$json_data = [];
			while($row = $result->fetchArray(SQLITE3_ASSOC)) {
				array_push($json_data, $row);
			};
			echo json_encode($json_data);
			$db->close();	
		};

	}
?>

