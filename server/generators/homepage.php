<?php
   function generateBody($userEmail) {
      require_once(dirname(__DIR__).'/api/user/Metadata.php');
      ['due' => $dueNumber, 'learning' => $learning, 'added' => $added] = getMetadata($userEmail);
      $addRecommendation = 10 - $learning;
      $dueNumber = 0;
      if ($dueNumber == 0 && $addRecommendation <= 0) {
         $addRecommendation = 4 - $added;
      }
      $recommendationBlock = '';
      
      if ($dueNumber <= 0 && $addRecommendation > 0) {
         $recommendationBlock = <<<EOD
            <div id="welcome_back-title_container">
               <p>Olá de novo, Deyvid!</p>
               <div>
                  <p id="revision">Não há nenhum verbo agendado para revisão hoje</p>
                  <p id="recomendation">Mas você ainda pode explorar novos verbos, recomendamos que você adicione $addRecommendation</p>
               </div>
            </div>
            <div id="hero_buttons-container">
               <a class="action-button" href="./study.php?type=2" >Descobrir novos verbos</a>
            </div>
         EOD;
      } else if ($addRecommendation <= 0 && $dueNumber > 0) {
         $plural = $dueNumber > 1 ? 's' : '';
         $recommendationBlock = <<<EOD
            <div id="welcome_back-title_container">
               <p>Olá de novo, Deyvid!</p>
               <div>
                  <p id="revision">Há $dueNumber verbo$plural para revisão hoje</p>
                  <p id="recomendation">Recomendamos que você não adicione novos verbos a sua lista de aprendizado hoje</p>
               </div>
            </div>
            <div id="hero_buttons-container">
               <a class="action-button" href="./study.php?type=1" >Revisar</a>
            </div>
         EOD;
      } else if ($addRecommendation <= 0 && $dueNumber <= 0) {
         $recommendationBlock = <<<EOD
         <div id="welcome_back-title_container">
            <p>Olá de novo, Deyvid!</p>
            <div>
               <p id="revision">Tudo certo por aqui!</p>
               <p id="recomendation">Você já concluiu todas as suas recomendações, mas você ainda pode descobrir novos verbos</p>
            </div>
         </div>
         <div id="hero_buttons-container">
            <a class="action-button" href="./study.php?type=2" >Descobrir novos verbos</a>
         </div>
      EOD;
      } else {
         $plural = $dueNumber > 1 ? 's' : '';
         $recommendationBlock = <<<EOD
            <div id="welcome_back-title_container">
               <p>Olá de novo, Deyvid!</p>
               <div>
                  <p id="revision">Há $dueNumber verbo$plural para revisão hoje</p>
                  <p id="recomendation">Recomendamos que você adicione $addRecommendation verbos a sua lista de aprendizado hoje</p>
               </div>
            </div>
            <div id="hero_buttons-container">
               <a class="action-button" href="./study.php?type=1" >Revisar</a>
               
               <a class="action-button" href="./study.php?type=2" >Descobrir novos verbos</a>
            </div>
         EOD;
      }

      $privateHomePage = <<<EOD
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
            <header class="hero-container --logged">

               <div id="welcome_back_container">
                  $recommendationBlock
               </div>
            </header>
            <main>
               <section class="test-container">
                  <h2 class="light-title">Explorar catálogo de verbos</h2>
                  <button class="action-button --limited">Vamos lá!</button>
               </section>
            </main>
            <footer>
               <div id="footer-links-container">
                  <p id="footer-internal-links">Master of tenses</p>
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
      EOD;
     
      echo $privateHomePage;
   }