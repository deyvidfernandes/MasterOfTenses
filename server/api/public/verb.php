<?php
   header('Content-Type: application/json');

   require_once '../../env.php';
   
   $conn = new mysqli(getenv('DB_URL'), getenv('DB_USERNAME'), getenv('DB_PASSWORD'), getenv('DB_SCHEMA'));

   if (isset($_GET['id'])) {
      $id = $_GET['id'];

      $stmt = $conn->prepare("SELECT * FROM verbs WHERE id=?");
      $stmt -> bind_param("s", $id);
   } else if (isset($_GET['name'])) {
      $name = $_GET['name'];

      $stmt = $conn->prepare("SELECT * FROM verbs WHERE infinitive like ?");
      $stmt -> bind_param("s", $name);
   } else {
      $order = isset($_GET['order']) ? $_GET['order'] : 'USAGE_INDEX';
      $reverse = isset($_GET['reverse']) ? $_GET['reverse'] : true;
      $position = isset($_GET['position']) ? $_GET['position'] : 0;
      $quantity = isset($_GET['quantity']) ? $_GET['quantity'] : 1;

      $modifier;
      switch ($order) {
         case 'USAGE_INDEX':
            $modifier = "usage_index";
            break;
         case 'ALPHABET':
            $modifier = "infinitive";
            break;
         case 'ID':
            $modifier = "id";
            break;
         default:
            throw new Error("Invalid order");
         }
      $modifierWithReverse = $modifier . " " . ($reverse ? "DESC" : "ASC");
      $stmt = $conn->prepare("SELECT * FROM verbs ORDER BY $modifierWithReverse LIMIT ?, ?");
      $stmt->bind_param("ii", $position, $quantity);

   }

   $stmt->execute();
   $result = $stmt->get_result();
   
   $stmt->close();
   $conn->close();
   echo json_encode($result->fetch_all(MYSQLI_ASSOC));
   