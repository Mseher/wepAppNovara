<?php
require 'db.php';

try {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['ID'])) {
        http_response_code(400);
        echo json_encode(['error' => 'ID is required for deletion']);
        exit;
    }

    $id = $input['ID'];
    $stmt = $conn->prepare("DELETE FROM documents WHERE ID = :ID");
    $stmt->bindValue(':ID', $id, PDO::PARAM_INT);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Document deleted successfully']);
    } else {
        throw new Exception('Deletion failed');
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
