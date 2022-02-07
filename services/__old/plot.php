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

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include('lib.php');

$pdflatex_path = get_dependency_path("pdflatex");
$pdf2svg_path = get_dependency_path("pdf2svg");

// check, if input is given
if(isset($_POST["input"]) == false) {
    echo "Error: POST 'input' is not set!";
    exit();
}

// create a temporary directory and store the input as JSON-file
$dir = "cache/" . random_int(0, PHP_INT_MAX) . "/";
$path = $dir . "plot2d.tex";
system('mkdir -p ' . $dir);    // TODO: output dev-error not writeable
file_put_contents($path, $_POST["input"]);

// run service-prog.js with input as argument
ob_start();
// 2>&1 redirects stderr to stdout
system("cd " . $dir . " && " . $pdflatex_path . " -halt-on-error --shell-escape plot2d.tex 2>&1");
$output = ob_get_contents();
ob_end_clean();

// output log
file_put_contents($dir . "log.txt", $output);

// convert from PDF to SVG
system("cd " . $dir . " && " . $pdf2svg_path . " plot2d.pdf plot2d.svg 2>&1");

// output image
$data = file_get_contents($dir . "plot2d.svg");
$base64 = 'data:image/svg+xml;base64,' . base64_encode($data);
echo $base64;

// delete temporary directory
system('rm -rf ' . $dir);  // TODO!!

?>
