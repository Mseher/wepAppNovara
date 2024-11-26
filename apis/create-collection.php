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
            Subject, Class, Owner, `References`, State_of_Preservation, 
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

    // Bind parameters
    $stmt->execute([
        ':COMMON_NAME' => $data['COMMON_NAME'],
        ':Inventory_Number' => $data['Inventory_Number'],
        ':Featured_Images' => $data['Featured_Images'],
        ':Scientific_Name' => $data['Scientific_Name'],
        ':Nomenclature_Adopted_By_Austrian_Scientists' => $data['Nomenclature_Adopted_By_Austrian_Scientists'],
        ':Collection_Date' => $data['Collection_Date'],
        ':MAIN_PLACES' => $data['MAIN_PLACES'],
        ':Collection_Place' => $data['Collection_Place'],
        ':Dimension' => $data['Dimension'],
        ':Indice_IUCN' => $data['Indice_IUCN'],
        ':Links' => $data['Links'],
        ':Subject' => $data['Subject'],
        ':Class' => $data['Class'],
        ':Owner' => $data['Owner'],
        ':References' => $data['References'], // Enclosed in backticks in query
        ':State_of_Preservation' => $data['State_of_Preservation'],
        ':Spline_Code' => $data['Spline_Code'],
        ':COORDINATES_DD' => $data['COORDINATES_DD'],
        ':COORDINATES_DMS' => $data['COORDINATES_DMS'],
        ':Description' => $data['Description'],
        ':Notes' => $data['Notes'],
        ':latitude' => $data['latitude'],
        ':longitude' => $data['longitude'],
    ]);

    // Respond with success
    header('Content-Type: application/json');
    echo json_encode(['success' => true, 'id' => $conn->lastInsertId()]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
