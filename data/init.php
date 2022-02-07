<?php

$db = new SQLite3('database.db');

$text = file_get_contents('courses/demo/demo-app-complex-1.txt');

$statement = $db->prepare("UPDATE Document SET documentText=:text WHERE documentName='demo'");
$statement->bindValue(':text', $text, SQLITE3_TEXT);
$statement->execute();

?>
