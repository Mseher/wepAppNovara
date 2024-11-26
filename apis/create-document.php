<?php
// Include the database connection file
require 'db.php';

// Retrieve JSON input
$input = file_get_contents('php://input');
$data = json_decode($input, true);

try {
    // Prepare SQL query with placeholders
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

    // Bind parameters
    $stmt->execute([
        ':TITLE_NAME' => $data['TITLE_NAME'],
        ':PLACE' => $data['PLACE'],
        ':PLACE_OF_COLLECTION' => $data['PLACE_OF_COLLECTION'],
        ':ALTERNATIVE_TITLE_NAME' => $data['ALTERNATIVE_TITLE_NAME'],
        ':ENGLISH_TRANSLATION' => $data['ENGLISH_TRANSLATION'],
        ':FIRST_AUTHOR' => $data['FIRST_AUTHOR'],
        ':SECOND_AUTHOR' => $data['SECOND_AUTHOR'],
        ':TRANSLATED_BY' => $data['TRANSLATED_BY'],
        ':EDITED_BY' => $data['EDITED_BY'],
        ':KIND_OF_SOURCES' => $data['KIND_OF_SOURCES'],
        ':MEDIUM' => $data['MEDIUM'],
        ':MEASURES_QUANTITY_FORMAT' => $data['MEASURES_QUANTITY_FORMAT'],
        ':LANGUAGE' => $data['LANGUAGE'],
        ':YEAR_DATE' => $data['YEAR_DATE'],
        ':PUBLISHER_PRINTER' => $data['PUBLISHER_PRINTER'],
        ':COORDINATES_DD' => $data['COORDINATES_DD'],
        ':PERIOD' => $data['PERIOD'],
        ':MAIN_LOCAL_INSTITUTION_INVOLVED' => $data['MAIN_LOCAL_INSTITUTION_INVOLVED'],
        ':MAIN_LOCAL_PERSON_INVOLVED' => $data['MAIN_LOCAL_PERSON_INVOLVED'],
        ':SECONDARY_LOCAL_PERSON_INVOLVED' => $data['SECONDARY_LOCAL_PERSON_INVOLVED'],
        ':AUSTRIAN_INSTITUTIONS_INVOLVED' => $data['AUSTRIAN_INSTITUTIONS_INVOLVED'],
        ':OTHER_PERSONS_INVOLVED' => $data['OTHER_PERSONS_INVOLVED'],
        ':NOVARA_SCIENTIST_INVOLVED' => $data['NOVARA_SCIENTIST_INVOLVED'],
        ':COLLECTING_MODE' => $data['COLLECTING_MODE'],
        ':CURRENT_OWNER' => $data['CURRENT_OWNER'],
        ':COLLECTION' => $data['COLLECTION'],
        ':SHELFMARK' => $data['SHELFMARK'],
        ':DIGITAL_VERSION' => $data['DIGITAL_VERSION'],
        ':IMAGE' => $data['IMAGE'],
        ':DESCRIPTION' => $data['DESCRIPTION'],
        ':REFERENCE_ENGLISH_EDITION' => $data['REFERENCE_ENGLISH_EDITION'],
        ':QUOTATIONS' => $data['QUOTATIONS'],
        ':QUOTATIONS_ORDER' => $data['QUOTATIONS_ORDER'],
        ':RESOURCES' => $data['RESOURCES'],
        ':RESOURCES_LINKS' => $data['RESOURCES_LINKS'],
        ':latitude' => $data['latitude'],
        ':longitude' => $data['longitude'],
    ]);

    // Return success response
    header('Content-Type: application/json');
    echo json_encode(['success' => 'Document added successfully.', 'id' => $conn->lastInsertId()]);
} catch (PDOException $e) {
    // Handle query execution errors
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
