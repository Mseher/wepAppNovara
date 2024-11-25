<?php
require 'db.php';

try {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['ID'])) {
        http_response_code(400);
        echo json_encode(['error' => 'ID is required for update']);
        exit;
    }

    $id = $input['ID'];
    unset($input['ID']);

    if (empty($input)) {
        http_response_code(400);
        echo json_encode(['error' => 'No fields provided for update']);
        exit;
    }

    $updateFields = [];
    foreach ($input as $column => $value) {
        $updateFields[] = "`$column` = :$column";
    }

    $sql = "UPDATE institutions SET " . implode(", ", $updateFields) . " WHERE ID = :ID";
    $stmt = $conn->prepare($sql);

    foreach ($input as $column => $value) {
        $stmt->bindValue(":$column", $value);
    }
    $stmt->bindValue(':ID', $id, PDO::PARAM_INT);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Institution updated successfully']);
    } else {
        throw new Exception('Update failed');
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
