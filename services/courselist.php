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
$course_list = array();

$courses_path = "../data/courses/";

function leave() {
    global $status, $error_message, $course_list;
    $output = array(
        "status" => $status,
        "error_message" => $error_message,
        "course_list" => $course_list
    );
    echo json_encode($output);
    exit();
}

$directories = glob($courses_path . "*", GLOB_ONLYDIR | GLOB_MARK);
foreach($directories as $course_path) {
    if(startsWith(basename($course_path), "."))
        continue;
    $course_meta_path = $course_path . "___meta.json";
    if(!file_exists($course_meta_path)) {
        $status = "error";
        $error_message = "course meta file does not exist";
        leave();
    }
    // read meta data
    $course_meta = json_decode(file_get_contents($course_meta_path));
    // check, if user has access to course
    if(is_admin() || in_array($user, $course_meta->access_read)) {
        array_push($course_list, basename($course_path));
    }
}

leave();

?>
