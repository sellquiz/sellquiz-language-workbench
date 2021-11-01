<?php

include 'lib.php';

//$maxima_path = "/usr/local/bin/maxima"; // TODO: depends on system

$maxima_path = "";
$config = file("../config.txt");
foreach($config as $line) {
    if(endsWith(trim($line), "/maxima")) {
        $maxima_path = trim($line);
        break;
    }
}

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
