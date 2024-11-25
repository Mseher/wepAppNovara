<?php
// Include the database connection file
require 'db.php';

try {
    // Get the stopover name from the request
    $stopover = isset($_GET['stopover']) ? trim($_GET['stopover']) : null;

    if (!$stopover) {
        // Return error if stopover is not provided
        http_response_code(400);
        echo json_encode(['error' => 'Stopover name is required']);
        exit;
    }

    // Query to fetch persons
    $personStmt = $conn->prepare("
        SELECT ID, FIRST_NAME, LAST_NAME, GENDER, LIFE_DATA, BIRTH_COUNTRY, TITLE, OCCUPATION, MAIN_ENCOUNTER_PLACE
        FROM persons
        WHERE MAIN_ENCOUNTER_PLACE = :stopover
    ");
    $personStmt->execute(['stopover' => $stopover]);
    $persons = $personStmt->fetchAll(PDO::FETCH_ASSOC);

    // Query to fetch collections
    $collectionStmt = $conn->prepare("
        SELECT ID, COMMON_NAME, Scientific_Name, Inventory_Number, Collection_Date, MAIN_PLACES, Collection_Place, Dimension, Indice_IUCN, State_of_Preservation, Subject
        FROM collections
        WHERE MAIN_PLACES = :stopover
    ");
    $collectionStmt->execute(['stopover' => $stopover]);
    $collections = $collectionStmt->fetchAll(PDO::FETCH_ASSOC);

    // Query to fetch documents
    $documentStmt = $conn->prepare("
        SELECT ID, TITLE_NAME, PLACE, PLACE_OF_COLLECTION, ENGLISH_TRANSLATION, FIRST_AUTHOR, KIND_OF_SOURCES, LANGUAGE, YEAR_DATE, CURRENT_OWNER
        FROM documents
        WHERE PLACE = :stopover
    ");
    $documentStmt->execute(['stopover' => $stopover]);
    $documents = $documentStmt->fetchAll(PDO::FETCH_ASSOC);

    // Query to fetch institutions
    $institutionStmt = $conn->prepare("
        SELECT ID, INSTITUTION_NAME, MAIN_PLACE, PLACE, FOUNDATION_DATE, DIRECTOR
        FROM institutions
        WHERE MAIN_PLACE = :stopover
    ");
    $institutionStmt->execute(['stopover' => $stopover]);
    $institutions = $institutionStmt->fetchAll(PDO::FETCH_ASSOC);

    // Return the data as JSON
    header('Content-Type: application/json');
    echo json_encode([
        'stopover' => $stopover,
        'data' => [
            'persons' => $persons,
            'collections' => $collections,
            'documents' => $documents,
            'institutions' => $institutions
        ]
    ]);
    exit;

} catch (PDOException $e) {
    // Handle database errors
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
