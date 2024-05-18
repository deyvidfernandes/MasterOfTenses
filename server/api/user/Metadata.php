<?php

   function getMetadata($userEmail) {
      $conn = new mysqli(getenv('DB_URL'), getenv('DB_USERNAME'), getenv('DB_PASSWORD'), getenv('DB_SCHEMA'));
      $verbsDueQuery = $conn->prepare(
         "SELECT COUNT(*) AS total
            FROM user_verb_in_study
            WHERE user_email = ? AND expires < DATE_ADD(UTC_TIMESTAMP(), INTERVAL 15 MINUTE)
         ");
      $verbsDueQuery->bind_param("s", $userEmail);
      $verbsDueQuery->execute();
      $due = $verbsDueQuery->get_result()->fetch_assoc()['total'];
      $verbsDueQuery->close();

      $verbsLearningQuery = $conn->prepare(
         "SELECT COUNT(*) AS total
            FROM user_verb_in_study
            WHERE user_email = ? AND difficult > 4 OR repetitions = 1
         ");
      $verbsLearningQuery->bind_param("s", $userEmail);
      $verbsLearningQuery->execute();
      $learning = $verbsLearningQuery->get_result()->fetch_assoc()['total'];
      $verbsLearningQuery->close();

      $verbsAddedQuery = $conn->prepare(
         "SELECT COUNT(*) AS total
            FROM user_verb_in_study
            WHERE user_email = ? AND DATE(last_review) = CURDATE() AND repetitions = 1
         ");
      $verbsAddedQuery->bind_param("s", $userEmail);
      $verbsAddedQuery->execute();
      $added = $verbsAddedQuery->get_result()->fetch_assoc()['total'];
      $verbsAddedQuery->close();
      $conn->close();

      return ["due" => $due, "learning" => $learning, "added" => $added];
   }
