<?php
// Include the database connection file
require 'db.php';

try {
    // Fetch all data from stopovers1 table
    $stmt = $conn->query("SELECT * FROM institutions");
    $stopovers = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Return data in JSON format
    header('Content-Type: application/json');
    echo json_encode($stopovers);

} catch (PDOException $e) {
    // Handle query execution errors
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch data: ' . $e->getMessage()]);
}
?>
