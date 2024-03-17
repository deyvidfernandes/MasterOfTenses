<?php

$env = [
   'DOMAIN_NAME' => 'localhost',
   'SECRET_JWT_KEY' => 'your-secret',
];

foreach ($env as $key => $value) {
   putenv("$key=$value");
}