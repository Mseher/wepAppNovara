<?php
// Include the database connection file
require 'db.php';

try {
    // Query to count total persons
    $personStmt = $conn->query("
        SELECT COUNT(*) AS count 
        FROM persons
    ");
    $personCount = $personStmt->fetch(PDO::FETCH_ASSOC)['count'];

    // Query to count total collections
    $collectionStmt = $conn->query("
        SELECT COUNT(*) AS count 
        FROM collections
    ");
    $collectionCount = $collectionStmt->fetch(PDO::FETCH_ASSOC)['count'];

    // Query to count total documents
    $documentStmt = $conn->query("
        SELECT COUNT(*) AS count 
        FROM documents
    ");
    $documentCount = $documentStmt->fetch(PDO::FETCH_ASSOC)['count'];

    // Query to count total institutions
    $institutionStmt = $conn->query("
        SELECT COUNT(*) AS count 
        FROM institutions
    ");
    $institutionCount = $institutionStmt->fetch(PDO::FETCH_ASSOC)['count'];

    // Return the counts as JSON
    header('Content-Type: application/json');
    echo json_encode([
        'counts' => [
            'persons' => $personCount,
            'collections' => $collectionCount,
            'documents' => $documentCount,
            'institutions' => $institutionCount
        ]
    ]);
} catch (PDOException $e) {
    // Handle database errors
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
