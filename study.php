<!DOCTYPE html>
<html lang="pt-br">
<head>
   <meta charset="UTF-8">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">

   <title>Teste</title>

   <!-- Remove estilos CSS predefinidos, deve ser incluído em todas as páginas antes de outros arquivos css-->
   <link rel="stylesheet" href="./styles/reset.css">

   <link rel="stylesheet" href="./styles/index.css">
   <link rel="stylesheet" href="./styles/exercise.css">

   <!-- Obtém a fonte Inter, deve ser incluído em todas as páginas -->
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet">
     
   <!-- Carrega o sistema de ícones Font Awesome -->
   <script src="https://kit.fontawesome.com/dcf57934cf.js" crossorigin="anonymous"></script>

   <!-- Aplica estilização dinâmica ao componente -->
   <script type="module" src="src/logic/ExerciseComponent.js" defer></script>

</head>

<?php
   require_once './server/util/JWTAuth.php';
   $isLogged = isset($_COOKIE['token']);
   $isLogged = $isLogged && JWT\validateAuthToken($_COOKIE['token']) == JWT\tokenState::valid;

   if (!$isLogged) {
      require_once './server/generators/errorMessages.php';
      ErrorMessages\generateError401HTML();
      exit();
   }
?>

<body>

      <nav>
         <a href="index.php">
            <img src="./static/logo-master-of-tenses.png" height="70px" alt="Logo da Master of Tenses, um relógio branco vestindo uma faixa vermelha como um ninja, a seu lado, o nome da marca.">
         </a>

         <ul id="nav-links">
            <li><a href="index.php">Início</a></li>
            <li><a href="login.html">Buscar verbos</a></li>
            <li><a href="signup.html">Meu aprendizado</a></li>
            <li><a href="signup.html">Conta</a></li>
         </ul>
      </nav>
      <main>
         <?php
            $type = $_GET['type'];
            
            if ($type == '1') {
               echo '<exercise-component type="exercise"></exercise-component>';
            } else if ($type == '2') {
               echo '<exercise-component type="discovery"></exercise-component>';
            };
         ?>
      </main>
      <footer>
         <div id="footer-links-container">
            <ul id="footer-internal-links">
               <ul><a href="index.php">Página Inicial</a></ul>
               <ul><a href="login.html">Login</a></ul>
               <ul><a href="signup.html">Cadastro</a></ul>
               <ul><a href="test.html">Teste</a></ul>
            </ul>
            <a href="https://github.com/deyvidfernandes/MasterOfTenses" target="_blank" id="github-link"><i class="fa-brands fa-github" style="color: #ffffff; font-size: 48px;"></i></a>
         </div>
         <div id="footer-message">
            <p>Desenvolvido com <i class="fa-solid fa-heart" style="color: #ffffff;"></i> para o TCC do curso Técnico em Desenvolvimento de Sistemas na ETEC</p>
            <p>2024</p>
         </div>
         <!-- Posiciona o link do github ao lado dos links internos sem influenciar no seu posicionamento -->
         <script src="./src/styling/footer.js"></script>
      </footer>
</body>
</html>