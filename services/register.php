<?php

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
