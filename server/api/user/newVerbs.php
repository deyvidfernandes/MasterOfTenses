<?php
   header('Content-Type: application/json');

   require_once '../../env.php';
   require_once '../../util/JWTAuth.php';
   
   $token = JWT\authenticate();
   $userEmail = $token->username;

   if (!$token->tokenState == JWT\tokenState::valid) {
      http_response_code(401);
      echo json_encode(['error' => 'Unauthorized']);
      exit();
   }

   $conn = new mysqli(getenv('DB_URL'), getenv('DB_USERNAME'), getenv('DB_PASSWORD'), getenv('DB_SCHEMA'));
   if ($_SERVER['REQUEST_METHOD'] === 'GET') {
      $stmt = $conn->prepare(
         "SELECT v.* FROM verbs v
            LEFT JOIN user_verb_in_study uvis 
               ON v.id = uvis.verb_id 
               AND uvis.user_email = ?
            WHERE uvis.user_email IS NULL
            ORDER BY v.usage_index DESC
            LIMIT 1;
      ");
      $stmt->bind_param("s", $userEmail);
      $stmt->execute();
      $verbData = $stmt->get_result()->fetch_assoc();
      $stmt->close();
      
      $conn->close();

      echo json_encode($verbData);

   } else {
      http_response_code(405); // Method Not Allowed
      echo json_encode(['error' => 'Método não permitido']);
   }
