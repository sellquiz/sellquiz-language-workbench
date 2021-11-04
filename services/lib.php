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

session_start();

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

function is_admin() {
    return strcmp($_SESSION["slw_user"], "admin") == 0;
}

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
