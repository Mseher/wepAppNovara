<?php
// $host = '35.214.176.23';
// $dbname = 'dbm4tfprtrafrv';
// $username = 'ulljka4qpgzwa';
// $password = '14re14y)@vm7';

$host = 'localhost';
$dbname = 'novara';
$username = 'root';
$password = '';

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}

?>
