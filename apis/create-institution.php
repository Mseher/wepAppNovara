<?php
require 'db.php';

// Get JSON input
$input = file_get_contents('php://input');
$data = json_decode($input, true);

try {
    // Insert Query
    $stmt = $conn->prepare("
        INSERT INTO institutions (
            INSTITUTION_NAME, MAIN_PLACE, PLACE, DIRECTOR, FOUNDATION_DATE,
            NATURE, REFERENCE, COORDINATES, `REFERENCES`, latitude, longitude
        ) VALUES (
            :INSTITUTION_NAME, :MAIN_PLACE, :PLACE, :DIRECTOR, :FOUNDATION_DATE,
            :NATURE, :REFERENCE, :COORDINATES, :REFERENCES, :latitude, :longitude
        )
    ");

    // Bind parameters
    $stmt->execute([
        ':INSTITUTION_NAME' => $data['INSTITUTION_NAME'],
        ':MAIN_PLACE' => $data['MAIN_PLACE'],
        ':PLACE' => $data['PLACE'],
        ':DIRECTOR' => $data['DIRECTOR'],
        ':FOUNDATION_DATE' => $data['FOUNDATION_DATE'],
        ':NATURE' => $data['NATURE'],
        ':REFERENCE' => $data['REFERENCE'],
        ':COORDINATES' => $data['COORDINATES'],
        ':REFERENCES' => $data['REFERENCES'], // Enclosed in backticks in query
        ':latitude' => $data['latitude'],
        ':longitude' => $data['longitude'],
    ]);

    // Respond with success
    header('Content-Type: application/json');
    echo json_encode(['success' => true, 'id' => $conn->lastInsertId()]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
