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

    // Query to count persons
    $personStmt = $conn->prepare("
        SELECT COUNT(*) AS count 
        FROM persons 
        WHERE MAIN_ENCOUNTER_PLACE = :stopover
    ");
    $personStmt->execute(['stopover' => $stopover]);
    $personCount = $personStmt->fetch(PDO::FETCH_ASSOC)['count'];

    // Query to count collections
    $collectionStmt = $conn->prepare("
        SELECT COUNT(*) AS count 
        FROM collections 
        WHERE MAIN_PLACES = :stopover
    ");
    $collectionStmt->execute(['stopover' => $stopover]);
    $collectionCount = $collectionStmt->fetch(PDO::FETCH_ASSOC)['count'];

    // Query to count documents
    $documentStmt = $conn->prepare("
        SELECT COUNT(*) AS count 
        FROM documents 
        WHERE PLACE = :stopover
    ");
    $documentStmt->execute(['stopover' => $stopover]);
    $documentCount = $documentStmt->fetch(PDO::FETCH_ASSOC)['count'];

    $institutionStmt = $conn->prepare("
    SELECT COUNT(*) AS count 
    FROM institutions 
    WHERE MAIN_PLACE = :stopover
");
$institutionStmt->execute(['stopover' => $stopover]);
$institutionCount = $institutionStmt->fetch(PDO::FETCH_ASSOC)['count'];


    // Return the counts as JSON
    header('Content-Type: application/json');
    echo json_encode([
        'stopover' => $stopover,
        'counts' => [
            'persons' => $personCount,
            'collections' => $collectionCount,
            'documents' => $documentCount,
            'institutions' => $institutionCount
        ]
    ]);
    exit;
    
} catch (PDOException $e) {
    // Handle database errors
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
