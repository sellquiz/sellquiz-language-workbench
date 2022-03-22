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

$db_path = "../data/database.db";
$db_server_path = "../data/servers/";

session_start();

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include "help.php";

function is_admin() {
    return strcmp($_SESSION["slw_user"], "admin") == 0;
}

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
            "error_str" => "SQL syntax error: " . $e
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

function compile($stdin, $cache) {
    // TODO: $cache
    $dir_path = sys_get_temp_dir() . '/slw/' . random_int(0, PHP_INT_MAX) . '/';
    mkdir($dir_path, 0777, true);
    $file_path_in = $dir_path . 'doc.txt';
    file_put_contents($file_path_in, $stdin);
    $file_path_out = $dir_path . 'doc.json';
    if(strlen($cache) > 0)
        file_put_contents($file_path_out, $cache);
    ob_start();
    system("node ../dist/slwCompiler.min.js " . $file_path_in . " " . $file_path_out);
    $output = ob_get_contents();  // TODO: check $output
    ob_end_clean();
    $res = file_get_contents($file_path_out);
    system("rm -r " . $dir_path);
    return $res;
}

function check_system() {
    $commands = array("node", "python3", "pdflatex", "sage", "octave", "maxima", "pdf2svg", "sqlite3", "gnuplot", "java", "javac");
    $s = "";
    foreach($commands as $command) {
        $s = $s . $command . ': ';
        $res = shell_exec("which " . $command);
        if(empty($res)) {
            $s = $s . 'NOT INSTALLED (run e.g. "sudo apt install ' . $command . '")';
        } else {
            $s = $s . 'OK';
        }
        $s = $s . "\n";
    }
    return $s;
}

function service($command) {

    $userId = 1; // TODO!!

    // TODO: check privileges for all queries!!
    global $sql_list, $db_path, $db_server_path;
    switch($command["type"]) {

        case "login":
            $res = json_decode(query($db_path,
                "SELECT userPasswordHash FROM User WHERE userName=:user;",
                $command["query_values"]
            )); // TODO: check for errors
            if(count($res->rows) > 0) {
                $passwordHash = $res->rows[0][0];
                if(password_verify($command["query_values"]["password"], $passwordHash)) {
                    $_SESSION['slw_user'] = $command["query_values"]["user"];
                    return "login successful";
                }
            }
            break;

        case "publish_document":
            // get compiled document
            $res = json_decode(query($db_path,
                "SELECT d.courseId, d.documentName, d.documentText, d.documentCompiled, c.courseName FROM Document d, Course c WHERE c.id = d.courseId AND d.id=:documentId;",
                $command["query_values"]
            )); // TODO: check for errors
            $courseId = $res->rows[0][0];
            $documentName = $res->rows[0][1];
            $documentText = $res->rows[0][2];
            $documentCompiled = $res->rows[0][3];
            $courseName = $res->rows[0][4];
            // insert course (if not existing)
            $params = [
                "courseId" => $courseId,
                "courseName" => $courseName
            ];
            query($db_server_path . $command["query_values"]["serverName"] . '.db',
                 "insert or ignore into Course (id, courseName) values (:courseId,:courseName);",
                 $params);
            // insert document (if not existing)
            $params = [
                "documentId" => $command["query_values"]["documentId"],
                "documentName" => $documentName,
                "documentText" => $documentText,
                "documentCompiled" => $documentCompiled,
                "courseId" => $courseId
            ];
            query($db_server_path . $command["query_values"]["serverName"] . '.db',
                "DELETE FROM Document WHERE id=:documentId;",
                $params);
            query($db_server_path . $command["query_values"]["serverName"] . '.db',
                 "INSERT INTO Document (id, documentName, documentText, documentCompiled, courseId) VALUES (:documentId,:documentName,:documentText,:documentCompiled,:courseId);",
                 $params);
            break;

        case "get_emulator_document":
            return query($db_server_path . $command["query_values"]["serverName"] . '.db',
                "SELECT d.documentCompiled FROM Document d, Course c WHERE d.courseId = c.id AND d.documentName=:documentName AND c.courseName=:courseName;",
                $command["query_values"]);
            break;

        case "check_system":
            return check_system();
            break;

        case "compile_document":
        case "compile_document_fast":
            $fast = strcmp($command["type"], "compile_document_fast") == 0;
            // get input and cache
            $res = json_decode(query($db_path,
                "SELECT documentText, documentCompiled FROM Document WHERE id=:documentId;",
                $command["query_values"]
            ));
            $u = $res->rows[0][0];
            $cache = $res->rows[0][1];
            if($fast == false)
                $cache = '';
            // compile
            $v = compile($u, $cache);
            // update cache
            query($db_path,
                "UPDATE Document SET documentCompiled=:cache WHERE id=:id;", [
                    "cache" => $v,
                    "id" => $command["query_values"]["documentId"]
                ]);
            return $v;
            break;

        case "get_server_list":
            return query($db_path,
                "SELECT * FROM Server;",
                $command["query_values"]);
            break;

        case "get_course_list":
            return query($db_path,
                "SELECT * FROM Course;",
                $command["query_values"]);
            break;

        case "get_course":
            return query($db_path,
                "SELECT id, courseName, courseDesc, courseDateCreated, courseDateModified FROM Course WHERE id=:id;",
                $command["query_values"]);
            break;

        case "get_document_list":
            return query($db_path,
                "SELECT id, documentOrderIndex, documentName, documentDesc, courseId, documentDateCreated, documentDateModified, documentState FROM Document WHERE courseId=:courseId ORDER BY documentOrderIndex ASC;",
                $command["query_values"]);
            break;

        case "create_document":
            $command["query_values"]["dateCreated"] = time();
            $command["query_values"]["dateModified"] = time();
            return query($db_path,
                "INSERT INTO Document (documentName, documentOrderIndex, documentDesc, documentText, documentCompiled, documentState, courseId, documentDateCreated, documentDateModified) VALUES (:name, :order, :desc, '', '', 'work-in-progress', :courseId, :dateCreated, :dateModified);",
                $command["query_values"]);
            break;

        case "delete_document":
            return query($db_path, "DELETE FROM Document WHERE id=:id",
                $command["query_values"]);
            break;

        case "get_document":
            return query($db_path,
                "SELECT * FROM Document WHERE id=:id;",
                $command["query_values"]);
            break;

        case "change_document_metadata":
            return query($db_path,
                "UPDATE Document SET documentOrderIndex=:order, documentName=:name, documentDesc=:description, documentDateModified=:modified WHERE id=:id;",
                $command["query_values"]);
            break;

        case "save_document":
            $command["query_values"]["dateModified"] = time();
            $command["query_values"]["userId"] = $userId;
            query($db_path,
                "UPDATE Document SET documentText=:text, documentDateModified=:dateModified WHERE id=:id;",
                $command["query_values"]);
            return query($db_path,
                "INSERT INTO DocumentBackup (documentId, documentBackupText, userId, documentBackupCreated) VALUES (:id,:text,:userId,:dateModified);",
                $command["query_values"]);
            break;

        default:
            return json_encode([
                "error" => true,
                "error_str" => "unknown service command type"
            ]);
    }
}

?>
