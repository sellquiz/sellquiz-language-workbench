<?php

include 'lib.php';

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
if(!in_array($_SESSION["slw_user"], $course_meta->access_read)) {
    $status = "error";
    $error_message = "read access to course denied";
    leave();
}

// read content
$file_content = file_get_contents($file_content_path);

leave();

?>
