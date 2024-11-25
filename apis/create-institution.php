<?php
require 'db.php';

// Retrieve JSON input
$input = file_get_contents('php://input');
$data = json_decode($input, true);

try {
    // Prepare SQL query
    $stmt = $conn->prepare("
        INSERT INTO institutions (
            INSTITUTION_NAME, MAIN_PLACE, PLACE, DIRECTOR, FOUNDATION_DATE,
            NATURE, REFERENCE, COORDINATES, REFERENCES, latitude, longitude
        ) VALUES (
            :INSTITUTION_NAME, :MAIN_PLACE, :PLACE, :DIRECTOR, :FOUNDATION_DATE,
            :NATURE, :REFERENCE, :COORDINATES, :REFERENCES, :latitude, :longitude
        )
    ");

    // Execute query
    $stmt->execute($data);

    // Respond with success
    header('Content-Type: application/json');
    echo json_encode(['success' => true, 'id' => $conn->lastInsertId()]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
