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

include 'service_core.php';

$user = $_POST["login-user"];
$password = $_POST["login-password"];

$command = [
    "type" => "login",
    "query_values" => [
        "user" => $user,
        "password" => $password
    ]
];
service($command);

/*$userpath = "../data/users/" . $user . ".json";

if(file_exists($userpath)) {
    $userdata = json_decode(file_get_contents($userpath), true);
    if(password_verify($password, $userdata["password-hash"]))
        $_SESSION['slw_user'] = $user;
}*/

header("Location: ../index.php");

?>
