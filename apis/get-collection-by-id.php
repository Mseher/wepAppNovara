<?php
require 'db.php';

if (isset($_GET['ID'])) {
    $id = intval($_GET['ID']);

    try {
        $stmt = $conn->prepare("SELECT * FROM collections WHERE ID = :ID");
        $stmt->bindParam(':ID', $id, PDO::PARAM_INT);
        $stmt->execute();
        $collection = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($collection) {
            header('Content-Type: application/json');
            echo json_encode($collection);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Collection not found']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch collection: ' . $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(['error' => 'ID parameter is required']);
}
?>
