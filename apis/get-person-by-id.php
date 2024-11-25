<?php
require 'db.php';

if (isset($_GET['id'])) {
    $id = intval($_GET['id']);

    try {
        $stmt = $conn->prepare("SELECT * FROM persons WHERE ID = :id");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $person = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($person) {
            header('Content-Type: application/json');
            echo json_encode($person);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Person not found.']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch person: ' . $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid request. ID is required.']);
}
?>
