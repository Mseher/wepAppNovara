<?php
// Include the database connection file
require 'db.php';

// Retrieve JSON input
$input = file_get_contents('php://input');
$data = json_decode($input, true);

try {
    // Prepare SQL query with placeholders
    $stmt = $conn->prepare("
        INSERT INTO persons (
            LAST_NAME, FIRST_NAME, GENDER, LIFE_DATA, BIRTH_COUNTRY, TITLE, OCCUPATION, OCCUPATION_TYPOLOGY,
            INSTITUTION, INSTITUTION_NAME, MAIN_ENCOUNTER_PLACE, SECONDARY_ENCOUNTER_PLACE,
            HOCHSTETTER_MISSION, SCHERZER_RETURN_VOYAGE, DATE, COORDINATES_DMS, COORDINATES_DD,
            RESOURCES, `REFERENCES`, latitude, longitude
        ) VALUES (
            :LAST_NAME, :FIRST_NAME, :GENDER, :LIFE_DATA, :BIRTH_COUNTRY, :TITLE, :OCCUPATION, :OCCUPATION_TYPOLOGY,
            :INSTITUTION, :INSTITUTION_NAME, :MAIN_ENCOUNTER_PLACE, :SECONDARY_ENCOUNTER_PLACE,
            :HOCHSTETTER_MISSION, :SCHERZER_RETURN_VOYAGE, :DATE, :COORDINATES_DMS, :COORDINATES_DD,
            :RESOURCES, :REFERENCES, :latitude, :longitude
        )
    ");

    // Bind parameters
    $stmt->execute([
        ':LAST_NAME' => $data['LAST_NAME'],
        ':FIRST_NAME' => $data['FIRST_NAME'],
        ':GENDER' => $data['GENDER'],
        ':LIFE_DATA' => $data['LIFE_DATA'],
        ':BIRTH_COUNTRY' => $data['BIRTH_COUNTRY'],
        ':TITLE' => $data['TITLE'],
        ':OCCUPATION' => $data['OCCUPATION'],
        ':OCCUPATION_TYPOLOGY' => $data['OCCUPATION_TYPOLOGY'],
        ':INSTITUTION' => $data['INSTITUTION'],
        ':INSTITUTION_NAME' => $data['INSTITUTION_NAME'],
        ':MAIN_ENCOUNTER_PLACE' => $data['MAIN_ENCOUNTER_PLACE'],
        ':SECONDARY_ENCOUNTER_PLACE' => $data['SECONDARY_ENCOUNTER_PLACE'],
        ':HOCHSTETTER_MISSION' => $data['HOCHSTETTER_MISSION'],
        ':SCHERZER_RETURN_VOYAGE' => $data['SCHERZER_RETURN_VOYAGE'],
        ':DATE' => $data['DATE'],
        ':COORDINATES_DMS' => $data['COORDINATES_DMS'],
        ':COORDINATES_DD' => $data['COORDINATES_DD'],
        ':RESOURCES' => $data['RESOURCES'],
        ':REFERENCES' => $data['REFERENCES'],
        ':latitude' => $data['latitude'],
        ':longitude' => $data['longitude'],
    ]);

    // Return success response
    header('Content-Type: application/json');
    echo json_encode(['success' => 'Person added successfully.', 'id' => $conn->lastInsertId()]);
} catch (PDOException $e) {
    // Handle query execution errors
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
