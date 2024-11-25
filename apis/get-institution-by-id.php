<?php
require 'db.php';

if (isset($_GET['ID'])) {
    $id = intval($_GET['ID']);

    try {
        $stmt = $conn->prepare("SELECT * FROM institutions WHERE ID = :ID");
        $stmt->bindParam(':ID', $id, PDO::PARAM_INT);
        $stmt->execute();
        $institution = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($institution) {
            header('Content-Type: application/json');
            echo json_encode($institution);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Institution not found']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch institution: ' . $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(['error' => 'ID parameter is required']);
}
?>
