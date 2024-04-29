<?php namespace JWT;
      require_once(dirname(__DIR__).'/env.php');


   enum tokenState: string {
      case expired = "expired";
      case invalid = "invalid";
      case valid = "valid";
   }

   /**
    * Gera um token JWT para o usuário especificado com validade em dias
    * @return string
    */
   function generateAuthToken(string $userName, int $durationInDays) {

      $header = (object) [
         'alg' => 'HS256',
         'typ' => "JWT",
         'exp' => 60*60*24* $durationInDays + time(),
         'iss' => getenv('DOMAIN_NAME'),
         'aud' => getenv('DOMAIN_NAME'),
         'sub' => $userName,
         'iat' => time()
      ];

      $encodedHeader = base64_encode(json_encode($header, JSON_UNESCAPED_SLASHES));
      $encodedPayload = base64_encode(json_encode((object) ['username' => $userName]));

      $signature = base64_encode(
         hash_hmac('sha256', $encodedHeader . "." . $encodedPayload, getenv('SECRET_JWT_KEY'))
      );

      return $encodedHeader . "." . $encodedPayload . "." . $signature;
   }

   /**
    * Armazena um token JWT no cookie 'token' por um tempo especificado em dias
    * @param string
    * @param int
    */
   function saveAuthTokenInCookie(string $token, $durationInDays) {
      setcookie(
         'token',
         $token,
         time()+60*60*24* $durationInDays,
         '/',
         getenv('DOMAIN_NAME'),
         false,
         true
      );
   }

   /**
    * Valida um token JWT e retorna o estado do token.
    * Se o token estiver na metade de seu tempo de expiração, um novo token com a duração do original será gerado e armazenado em cookies.
    * @param string
    * @return tokenState
    */
   function validateAuthToken($token) {

      $tokenParts = explode(".", $token);
      $headerData = json_decode(base64_decode($tokenParts[0]));

      $decodedSignature = base64_decode($tokenParts[2]);
      $expectedSignature = hash_hmac('sha256', $tokenParts[0] . "." . $tokenParts[1], getenv('SECRET_JWT_KEY'));
      $isPasswordInteger = $expectedSignature == $decodedSignature;

      if (!is_object($headerData) || !property_exists($headerData, 'exp')) {
         return tokenState::invalid;
      }

      $tokenExpirationDate = $headerData->exp;

      $isTokenExpired = time() > $tokenExpirationDate;

      $tokenState = match (true) {
         $isTokenExpired => tokenState::expired,
         !$isPasswordInteger => tokenState::invalid,
         default => tokenState::valid
      };

      // gere um novo token se ele estiver à menos da metade do tempo de expiração
      $tokenDuration = $headerData->exp - $headerData->iat;
      if ($tokenState == tokenState::valid && $tokenExpirationDate - time() < $tokenDuration / 2) {
         $newToken = generateAuthToken($headerData->sub, $tokenDuration / (60*60*24));
         saveAuthTokenInCookie($newToken, $tokenDuration / (60*60*24));
      }

      return $tokenState;
   }

   function getUsernameFromToken(string $token) {
      $tokenParts = explode(".", $token);
      $headerData = json_decode(base64_decode($tokenParts[0]));
      if (!is_object($headerData) || !property_exists($headerData, 'sub')) {
         return null;
      }
      return $headerData->sub;
   }

   class AuthenticationResult {
      public ?string $username;
      public ?tokenState $tokenState;
  }

   /**
    * Verifica se o token JWT armazenado em cookies é válido e retorna um objeto contendo o estado do token e o nome do usuário.
    * Se o token verificado estiver na metade de seu tempo de expiração, um novo token com a duração do original será gerado e armazenado em cookies.
    * @return AuthenticationResult
    */
   function authenticate()  {
         if (isset($_COOKIE['token'])) {
            $token = $_COOKIE['token'];
   
            $tokenState = validateAuthToken($token);
            $username = getUsernameFromToken($token);

            $result = new AuthenticationResult();
            $result->username = $username;
            $result->tokenState = $tokenState;
            return $result;
         } else {
            return new AuthenticationResult();
         }
   }