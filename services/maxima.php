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

$maxima_path = get_dependency_path("maxima");

//echo "$maxima_path";
//exit();

// create a temporary directory and store the input
$dir = "../cache/" . random_int(0, PHP_INT_MAX) . "/";
$path = $dir . "maxima-input.txt";

system('mkdir -p ' . $dir);    // TODO: output dev-error, if not writeable
file_put_contents($path, $_POST["input"]);

// run maxima
$cmd = "ulimit -t 20 && " . $maxima_path . " -q -b " . $path;
$output = shell_exec($cmd);

// delete temporary directory
system('rm -rf ' . $dir);

// print result
echo $output;

?>
