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
   if ($_SERVER['REQUEST_METHOD'] === 'POST') {
      $input = json_decode(file_get_contents('php://input'), true);
      
      // Verifica se o JSON foi decodificado corretamente
      if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
         // Erro ao decodificar o JSON
         http_response_code(400); // Bad Request
         echo json_encode(array('error' => 'Erro ao decodificar JSON'));
         exit;
      }

      $stmt = $conn->prepare("INSERT INTO user_verb_in_study (user_email, verb_id, expires, stability, difficult, repetitions, lapses, learning_state, last_review) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
      $stmt->bind_param("sssiiiiis", $userEmail, $input['verb_id'], $input['expires'], $input['stability'], $input['difficult'], $input['repetitions'], $input['lapses'], $input['learning_state'], $input['last_review']);
      $stmt->execute();
      $result = $stmt->get_result();
   }
