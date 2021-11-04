<?php

/******************************************************************************
 * SELLQUIZ-LANGUAGE-WORKBENCH                                                *
 *                                                                            *
 * Copyright (c) 2019-2021 TH Köln                                            *
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

include 'lib.php';

$user = $_SESSION["slw_user"];
$course = $_POST["course"];

$status = "ok";
$error_message = "";
$file_list = array();

function leave() {
    global $status, $error_message, $file_list;
    $output = array(
        "status" => $status,
        "error_message" => $error_message,
        "file_list" => $file_list
    );
    echo json_encode($output);
    exit();
}

$course_path = "../data/courses/" . $course . "/";
$course_meta_path = $course_path . "___meta.json";

if(!file_exists($course_path)) {
    $status = "error";
    $error_message = "course does not exist";
    leave();
}

if(!file_exists($course_meta_path)) {
    $status = "error";
    $error_message = "course meta file does not exist";
    leave();
}

// read meta data
$course_meta = json_decode(file_get_contents($course_meta_path));

// check, if user has access to course
if(!is_admin() && !in_array($user, $course_meta->access_read)) {
    $status = "error";
    $error_message = "access not permitted";
    leave();
}

// get files
$files = glob($course_path . "*.txt", GLOB_MARK);
foreach($files as $file_path) {
    if(startsWith(basename($file_path), "."))
        continue;
    if(endsWith($file_path, "/"))
        continue;
    array_push($file_list, basename($file_path));
}

leave();

?>
