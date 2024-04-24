<?php
require_once 'util/JWTAuth.php';
$isLogged = isset($_COOKIE['token']);
$isLogged = $isLogged && JWT\validateAuthToken($_COOKIE['token']) == JWT\tokenState::valid;

$publicHomePage = <<<EOD
<!DOCTYPE html>
<html lang="pt-br">
<head>
   <meta charset="UTF-8">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">

   <title>Home</title>

   <!-- Remove estilos CSS predefinidos, deve ser incluído em todas as páginas antes de outros arquivos css-->
   <link rel="stylesheet" href="./styles/reset.css">

   <link rel="stylesheet" href="./styles/index.css">
   <link rel="stylesheet" href="./styles/home.css">

   <!-- Obtém a fonte Inter, deve ser incluído em todas as páginas -->
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet">
   
   <!-- Carrega o sistema de ícones Font Awesome -->
   <script src="https://kit.fontawesome.com/dcf57934cf.js" crossorigin="anonymous"></script>

</head>
<body>
      <header class="hero-container">
         <div>
            <a href="index.php">
               <img src="./static/logo-master-of-tenses.png" height="80px" alt="Logo da Master of Tenses, um relógio branco vestindo uma faixa vermelha como um ninja, a seu lado, o nome da marca.">
            </a>
            <div id="hero_title-container">
               <h1>Conheça um jeito <span>moderno</span></h1>
               <h1>de aprender os verbos irregulares do Inglês</h1>
            </div>
            <p id="hero_paragraph">Aqui você encontra um método de aprendizagem semelhante a Flashcards, mas preparado com um catálogo de mais de 200 verbos irregulares e muitos outros recursos para facilitar seu aprendizado</p>
            <div id="hero_buttons-container">
               <button class="action-button --limited">Login</button>
               <button class="action-button --limited">Cadastre-se</button>
            </div>
         </div>
      </header>
      <main>
         <section class="test-container">
            <h2 class="light-title">Experimente nosso método</h2>
            <button class="action-button --limited">Vamos lá!</button>
         </section>
         <section id="benefits-section">
            <h2 class="medium-title">Quais vantagens o <span class="brand">Master of Tenses</span> oferece?</h2>

            <div id="benefits-container">
               
                  <div class="benefit">
                     <h3>Estude em qualquer lugar</h3>
                     <p>Você pode acessar a nossa plataforma por celulares, tablets ou desktop. Nós também salvamos o seu progresso, então você pode continuar de onde parou.</p>
                     <img src="" alt="">
                  </div>
                  <hr>
                  <div class="benefit">
                     <h3>Aprenda do jeito certo</h3>
                     <p>Aqui você vai aprender dos verbos mais usados para os menos comuns, assim desenvolver um vocabulário muito útil rapidamente, para nunca mais ficar em dúvida na escrita ou fala quando precisar encontrar um verbo irregular.</p>
                  </div>
                  <hr>
                  <div class="benefit">
                     <h3>Use um método de aprendizagem cientificamente comprovado</h3>
                     <p>A repetição espaçada é uma técnica onde a memória de longo prazo pode ser formada eficientemente seguindo um cronograma de revisões calculado por algum algoritmo. Nós usamos o Free Spaced Repetition Scheduler (FSRS) ou Agendador de Repetições Espaçadas Livre, que provou ser um dos algoritmos mais precisos da categoria.</p>
                     <img src="" alt="">
                  </div>
                  <hr>
                  <div class="benefit">
                     <h3>Aproveite o poder da IA para acelerar seu aprendizado</h3>
                     <p>Nós usamos inteligência artificial para ajustar o FSRS à seus padrões individuais de aprendizado, revisão e esquecimento. Dessa forma, quanto mais você estudar mais eficiente nosso método vai se tornar.</p>
                  </div>
                  <hr>
                  <div class="benefit">
                     <h3>E muitos outros recursos para você</h3>
                     <p>Aproveite nosso catálogo com mais de 200 verbos irregulares, aprenda a pronúncia de todas as formas de um verbo novo e seu significado na página do exercício, sem precisar acessar um dicionário online, e, se desejar, você ainda pode configurar seu aprendizado para Inglês Britânico.</p>
                  </div>
                  <hr>
                  <div id="cta-container">
                     <p class="medium-title">E então? Pronto para se tornar um <span class="brand">Master of Tenses?</span></p>
                     <button class="action-button --limited">Cadastre-se</button>
                  </div>
            </div>
         </section>
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
EOD;

if ($isLogged) {
   echo "Você está logado";
} else {
   echo $publicHomePage;
}
