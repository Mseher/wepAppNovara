<?php
require 'db.php';

// Retrieve JSON input
$input = file_get_contents('php://input');
$data = json_decode($input, true);

try {
    // Prepare SQL query
    $stmt = $conn->prepare("
        INSERT INTO documents (
            TITLE_NAME, PLACE, PLACE_OF_COLLECTION, ALTERNATIVE_TITLE_NAME, 
            ENGLISH_TRANSLATION, FIRST_AUTHOR, SECOND_AUTHOR, TRANSLATED_BY, 
            EDITED_BY, KIND_OF_SOURCES, MEDIUM, MEASURES_QUANTITY_FORMAT, 
            LANGUAGE, YEAR_DATE, PUBLISHER_PRINTER, COORDINATES_DD, 
            PERIOD, MAIN_LOCAL_INSTITUTION_INVOLVED, MAIN_LOCAL_PERSON_INVOLVED, 
            SECONDARY_LOCAL_PERSON_INVOLVED, AUSTRIAN_INSTITUTIONS_INVOLVED, 
            OTHER_PERSONS_INVOLVED, NOVARA_SCIENTIST_INVOLVED, COLLECTING_MODE, 
            CURRENT_OWNER, COLLECTION, SHELFMARK, DIGITAL_VERSION, IMAGE, 
            DESCRIPTION, REFERENCE_ENGLISH_EDITION, QUOTATIONS, QUOTATIONS_ORDER, 
            RESOURCES, RESOURCES_LINKS, latitude, longitude
        ) VALUES (
            :TITLE_NAME, :PLACE, :PLACE_OF_COLLECTION, :ALTERNATIVE_TITLE_NAME, 
            :ENGLISH_TRANSLATION, :FIRST_AUTHOR, :SECOND_AUTHOR, :TRANSLATED_BY, 
            :EDITED_BY, :KIND_OF_SOURCES, :MEDIUM, :MEASURES_QUANTITY_FORMAT, 
            :LANGUAGE, :YEAR_DATE, :PUBLISHER_PRINTER, :COORDINATES_DD, 
            :PERIOD, :MAIN_LOCAL_INSTITUTION_INVOLVED, :MAIN_LOCAL_PERSON_INVOLVED, 
            :SECONDARY_LOCAL_PERSON_INVOLVED, :AUSTRIAN_INSTITUTIONS_INVOLVED, 
            :OTHER_PERSONS_INVOLVED, :NOVARA_SCIENTIST_INVOLVED, :COLLECTING_MODE, 
            :CURRENT_OWNER, :COLLECTION, :SHELFMARK, :DIGITAL_VERSION, :IMAGE, 
            :DESCRIPTION, :REFERENCE_ENGLISH_EDITION, :QUOTATIONS, :QUOTATIONS_ORDER, 
            :RESOURCES, :RESOURCES_LINKS, :latitude, :longitude
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
