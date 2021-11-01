<?php

include 'lib.php';

$user = $_POST["login-user"];
$password = $_POST["login-password"];

$userpath = "../data/users/" . $user . ".json";

if(file_exists($userpath)) {
    $userdata = json_decode(file_get_contents($userpath), true);
    if(password_verify($password, $userdata["password-hash"]))
        $_SESSION['slw_user'] = $user;
}

header("Location: ../index.php");

?>
