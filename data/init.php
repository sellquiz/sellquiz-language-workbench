<?php

$db = new SQLite3('database.db');

$text = file_get_contents('demo.txt');

$statement = $db->prepare("UPDATE Document SET documentText=:text WHERE documentName='demo'");
$statement->bindValue(':text', $text, SQLITE3_TEXT);
$statement->execute();

?>
