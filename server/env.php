<?php

$env = [
   'DOMAIN_NAME' => 'localhost',
   'SECRET_JWT_KEY' => 'your-secret',
   'AUTHENTICATION_DURATION_IN_DAYS' => '14',
   'DB_USERNAME' => 'root',
   'DB_PASSWORD' => 'senha',
   'DB_SCHEMA' => 'master_of_tenses',
   'DB_URL' => 'localhost',
];

foreach ($env as $key => $value) {
   putenv("$key=$value");
}