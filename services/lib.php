<?php

session_start();

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

function is_identifier($s) {
    $n = strlen($s);
    for($i=0; $i<$n; $i++) {
        $ch = $s[$i];
        $is_alpha = ($ch == '_') || ($ch >= 'A' && $ch <= 'Z') || ($ch >= 'a' && $ch <= 'z');
        $is_number = ($ch >= '0' && $ch <= '9');
        if($i==0 && !$is_alpha)
            return false;
        if($i>0 && !$is_alpha && !$is_number)
            return false;
    }
    return true;
}

function get_dependency_path($dep_name) {
    $path = "";
    $config = file("../config.txt");
    foreach($config as $line) {
        if(endsWith(trim($line), "/" . $dep_name)) {
            $path = trim($line);
            break;
        }
    }
    return $path;
}

// https://stackoverflow.com/questions/834303/startswith-and-endswith-functions-in-php
function startsWith( $haystack, $needle ) {
    $length = strlen( $needle );
    return substr( $haystack, 0, $length ) === $needle;
}

// https://stackoverflow.com/questions/834303/startswith-and-endswith-functions-in-php
function endsWith( $haystack, $needle ) {
    $length = strlen( $needle );
    if( !$length ) {
        return true;
    }
    return substr( $haystack, -$length ) === $needle;
}

?>
