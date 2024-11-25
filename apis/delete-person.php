<?php
// Include the database connection file
require 'db.php';

try {
    // Read the input data
    $input = json_decode(file_get_contents('php://input'), true);

    // Validate the input
    if (!isset($input['ID'])) {
        http_response_code(400);
        echo json_encode(['error' => 'ID is required for deletion']);
        exit;
    }

    $id = $input['ID'];

    // Prepare the SQL statement
    $sql = "DELETE FROM persons WHERE ID = :ID";
    $stmt = $conn->prepare($sql);

    // Bind the ID parameter
    $stmt->bindValue(':ID', $id, PDO::PARAM_INT);

    // Execute the query
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Person deleted successfully']);
    } else {
        throw new Exception('Failed to delete person');
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
