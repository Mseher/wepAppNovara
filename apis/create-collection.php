<?php
require 'db.php';

// Get JSON input
$input = file_get_contents('php://input');
$data = json_decode($input, true);

try {
    // Insert Query
    $stmt = $conn->prepare("
        INSERT INTO collections (
            COMMON_NAME, Inventory_Number, Featured_Images, Scientific_Name, 
            Nomenclature_Adopted_By_Austrian_Scientists, Collection_Date, 
            MAIN_PLACES, Collection_Place, Dimension, Indice_IUCN, Links, 
            Subject, Class, Owner, References, State_of_Preservation, 
            Spline_Code, COORDINATES_DD, COORDINATES_DMS, Description, 
            Notes, latitude, longitude
        ) VALUES (
            :COMMON_NAME, :Inventory_Number, :Featured_Images, :Scientific_Name, 
            :Nomenclature_Adopted_By_Austrian_Scientists, :Collection_Date, 
            :MAIN_PLACES, :Collection_Place, :Dimension, :Indice_IUCN, :Links, 
            :Subject, :Class, :Owner, :References, :State_of_Preservation, 
            :Spline_Code, :COORDINATES_DD, :COORDINATES_DMS, :Description, 
            :Notes, :latitude, :longitude
        )
    ");

    // Execute query
    $stmt->execute($data);

    // Respond with success
    header('Content-Type: application/json');
    echo json_encode(['success' => true, 'id' => $conn->lastInsertId()]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
