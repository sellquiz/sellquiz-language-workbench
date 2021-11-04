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

$status = "ok";
$error_message = "";
$course_meta = null;
$file_content = "";
$file_meta = null;

$course_path = "../data/courses/" . $_POST["course"] . "/";
$course_meta_path = $course_path . "___meta.json";
$file_content_path = $course_path . $_POST["file"] . ".txt";
$file_meta_path = $course_path . $_POST["file"] . ".meta.json";

function leave() {
    global $status, $error_message, $file_content;
    $output = array(
        "status" => $status,
        "error_message" => $error_message,
        "content" => $file_content
    );
    echo json_encode($output);
    exit();
}

if(!file_exists($course_meta_path)) {
    $status = "error";
    $error_message = "course meta file does not exist";
    leave();
}
if(!file_exists($file_content_path)) {
    $status = "error";
    $error_message = "content file does not exist";
    leave();
}
if(!file_exists($file_meta_path)) {
    $status = "error";
    $error_message = "meta file does not exist";
    leave();
}

// read meta data
$course_meta = json_decode(file_get_contents($course_meta_path));
$file_meta = json_decode(file_get_contents($file_meta_path));
    
// check, if user has access to course
if(!is_admin() && !in_array($user, $course_meta->access_read)) {
    $status = "error";
    $error_message = "read access to course denied";
    leave();
}

// read content
$file_content = file_get_contents($file_content_path);

leave();

?>
