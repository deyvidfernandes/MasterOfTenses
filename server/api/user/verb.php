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
      if ($input === null && json_last_error() !== JSON_ERROR_NONE) {
         // Erro ao decodificar o JSON
         http_response_code(400); // Bad Request
         echo json_encode(array('error' => 'Erro ao decodificar JSON'));
         exit;
      }

      $stmt = $conn->prepare(
         "INSERT INTO user_verb_in_study (user_email, verb_id, expires, stability, difficult, repetitions, lapses, learning_state, last_review) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) AS new
            ON DUPLICATE KEY UPDATE 
               expires = ?, 
               stability = ?,
               difficult = ?,
               repetitions = ?,
               lapses = ?,
               learning_state = ?,
               last_review = ?;"
         );
      $stmt->bind_param("sssiiiiis"."siiiiis", $userEmail, $input['verb_id'], $input['expires'], $input['stability'], $input['difficult'], $input['repetitions'], $input['lapses'], $input['learning_state'], $input['last_review'], $input['expires'], $input['stability'], $input['difficult'], $input['repetitions'], $input['lapses'], $input['learning_state'], $input['last_review']);
      $stmt->execute();
      $stmt->close();
      $conn->close();

   } else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
      $metadataQuery = $conn->prepare(
            "SELECT *
               FROM user_verb_in_study
               WHERE user_email = ? AND expires < DATE_ADD(UTC_TIMESTAMP(), INTERVAL 15 MINUTE)
               ORDER BY expires ASC
               LIMIT 1
            ");
      $metadataQuery->bind_param("s", $userEmail);
      $metadataQuery->execute();
      $metadataResult = $metadataQuery->get_result();
      $metadataData = $metadataResult->fetch_assoc();

      $revisionsDone = mysqli_num_rows($metadataResult) === 0;
      if ($revisionsDone) {
         echo json_encode(['metadata' => null, 'verbData' => null]);
         exit();
      }

      $metadataQuery->close();

      $verbDataQuery = $conn->prepare("SELECT * FROM verbs WHERE id = ?;");
      $verbDataQuery->bind_param("i", $metadataData['verb_id']);
      $verbDataQuery->execute();
      $verbData = $verbDataQuery->get_result()->fetch_assoc();


      $verbDataQuery->close();
      
      $conn->close();

      echo json_encode(['metadata' => $metadataData, 'verbData' => $verbData]);

   } else {
      http_response_code(405); // Method Not Allowed
      echo json_encode(['error' => 'Método não permitido']);
   }
