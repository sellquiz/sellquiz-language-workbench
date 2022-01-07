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

include 'lib.php';

$_SESSION['slw_error'] = "";

$access = $_POST["register-access"]; // TODO: check access!!
$user = $_POST["register-user"];
$name = $_POST["register-name"];
$mail = $_POST["register-mail"];
$password1 = $_POST["register-password-1"];
$password2 = $_POST["register-password-2"];

$userpath = "../data/users/" . $user . ".json";

if(!is_identifier($user)) {
    $_SESSION['slw_error'] = "Registration failed: username is not a valid identifier!";
    header("Location: ../index.php");
    exit();
}

if(file_exists($userpath)) {
    $_SESSION['slw_error'] = "Registration failed: user '" . $user . "' already exists!";
    header("Location: ../index.php");
    exit();
}

if(strcmp($password1, $password2) != 0) {
    $_SESSION['slw_error'] = "Registration failed: passwords do not match!";
    header("Location: ../index.php");
    exit();
}

if(strlen($password1) < 8) {
    $_SESSION['slw_error'] = "Registration failed: password is too short!";
    header("Location: ../index.php");
    exit();
}

$userdata = [
    "id" => $user,
    "name" => $name,
    "mail" => $mail,
    "password-hash" => password_hash($password1, PASSWORD_DEFAULT)
];

file_put_contents($userpath, json_encode($userdata));

$_SESSION['slw_user'] = $user;

header("Location: ../index.php");

?>
