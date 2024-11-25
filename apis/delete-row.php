<?php
// Include the database connection file
require 'db.php';

// Set content type to JSON
header('Content-Type: application/json');

// Function to send a JSON response
function sendResponse($success, $message = '', $error = '')
{
    echo json_encode(['success' => $success, 'message' => $message, 'error' => $error]);
    exit;
}

try {
    // Parse incoming JSON payload
    $input = json_decode(file_get_contents('php://input'), true);

    // Validate the required fields
    if (!isset($input['table']) || !isset($input['idField']) || !isset($input['id'])) {
        sendResponse(false, '', 'Missing required fields: table, idField, or id');
    }

    // Sanitize inputs
    $table = preg_replace('/[^a-zA-Z0-9_]/', '', $input['table']); // Allow only alphanumeric and underscores
    $idField = preg_replace('/[^a-zA-Z0-9_]/', '', $input['idField']); // Same sanitization
    $id = $input['id'];

    // Prepare the SQL statement
    $stmt = $conn->prepare("DELETE FROM $table WHERE $idField = :id");
    $stmt->bindParam(':id', $id);

    // Execute the statement
    if ($stmt->execute()) {
        sendResponse(true, 'Row deleted successfully');
    } else {
        sendResponse(false, '', 'Failed to delete row');
    }
} catch (PDOException $e) {
    // Handle database errors
    sendResponse(false, '', 'Database error: ' . $e->getMessage());
}
?>
