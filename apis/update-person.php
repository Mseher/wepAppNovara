<?php
// Include the database connection file
require 'db.php';

try {
    // Read the input data
    $input = json_decode(file_get_contents('php://input'), true);

    // Validate the input
    if (!isset($input['ID'])) {
        http_response_code(400);
        echo json_encode(['error' => 'ID is required for update']);
        exit;
    }

    // ID is required, remove it from attributes to be updated
    $id = $input['ID'];
    unset($input['ID']);

    // Check if there are other attributes to update
    if (empty($input)) {
        http_response_code(400);
        echo json_encode(['error' => 'No attributes provided for update']);
        exit;
    }

    // Build the dynamic SQL query
    $updateFields = [];
    foreach ($input as $column => $value) {
        $updateFields[] = "`$column` = :$column"; // Securely bind parameters
    }
    $updateQuery = implode(", ", $updateFields);

    $sql = "UPDATE persons 
            SET $updateQuery 
            WHERE ID = :ID";

    $stmt = $conn->prepare($sql);

    // Bind parameters dynamically
    foreach ($input as $column => $value) {
        $stmt->bindValue(":$column", $value);
    }
    $stmt->bindValue(":ID", $id, PDO::PARAM_INT);

    // Execute the query
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Person updated successfully']);
    } else {
        throw new Exception('Failed to update person');
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
