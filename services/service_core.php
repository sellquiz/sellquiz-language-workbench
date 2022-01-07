<?php

/******************************************************************************
 * SELLQUIZ-LANGUAGE-WORKBENCH                                                *
 *                                                                            *
 * Copyright (c) 2019-2022 TH Köln                                            *
 * Author: Andreas Schwenk, contact@compiler-construction.com                 *
 *                                                                            *
 * Partly funded by: Digitale Hochschule NRW                                  *
 * https://www.dh.nrw/kooperationen/hm4mint.nrw-31                            *
 *                                                                            *
 * GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007                         *
 *                                                                            *
 * This library is licensed as described in LICENSE, which you should have    *
 * received as part of this distribution.                                     *
 *                                                                            *
 * This software is distributed on "AS IS" basis, WITHOUT WARRENTY OF ANY     *
 * KIND, either impressed or implied.                                         *
 ******************************************************************************/

include "help.php";


$db_path="../data/database.db";


function query($database_path, $statement, $values) {
    $db = new SQLite3($database_path);
    $s = null;
    $db->enableExceptions(true);
    try {
        $s = $db->prepare($statement);
        foreach($values as $name => $value) {
            $s->bindValue($name, $value);
        }
        $query_result = $s->execute();
    } catch(Exception $e) {
        $db->close();
        return json_encode([
            "error" => true,
            "error_str" => "SQL syntax error"
        ]);
    }
    if($query_result == false) {
        $db->close();
        return json_encode([
            "error" => true,
            "error_str" => "SQL query error"
        ]);
    }
    $col_names = array();
    $rows = array();
    if(startsWith($statement, "SELECT") || startsWith($statement, "select")) {
        // bad design of sqlite3: fetchArray executes query again...
        for($i=0; $i<$query_result->numColumns(); $i++) {
            array_push($col_names, $query_result->columnName($i));
        }
        while($row = $query_result->fetchArray(SQLITE3_NUM)) {
            array_push($rows, $row);
        }
    }
    $changes = $db->changes();
    $db->close();
    return json_encode([
        "error" => false,
        "error_str" => "",
        "columnNames" => $col_names,
        "rows" => $rows,
        "rows_changed" => $changes
    ]);
}

function service($command) {
    global $sql_list, $db_path;
    switch($command["type"]) {
        case "get_courselist":
            return query($db_path, "SELECT * FROM Course;", $command["query_values"]);
            break;
        default:
            return json_encode([
                "error" => true,
                "error_str" => "unknown service command type"
            ]);
    }
}

?>
