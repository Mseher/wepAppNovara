<?php
require 'db.php';

if (isset($_GET['ID'])) {
    $id = intval($_GET['ID']);

    try {
        $stmt = $conn->prepare("SELECT * FROM documents WHERE ID = :ID");
        $stmt->bindParam(':ID', $id, PDO::PARAM_INT);
        $stmt->execute();
        $document = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($document) {
            header('Content-Type: application/json');
            echo json_encode($document);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Document not found']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch document: ' . $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(['error' => 'ID parameter is required']);
}
?>
