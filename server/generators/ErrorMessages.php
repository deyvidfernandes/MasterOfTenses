<?php namespace ErrorMessages;
   function generateError401HTML() {
      $styles = file_get_contents(dirname(dirname(__DIR__)).'/styles/error.css');
      echo <<<EOD
         <style>
            $styles
         </style>
         <body>
            <main class="dark-background">
               <div class="error-container">
                     <div>
                        <h1 id="error-code">Erro 401</h1>
                        <p id="error-description">(Não autorizado)</p>
                        <p id="message-for-user">Por favor faça login e tente novamente</p>
                        <a class="action-button --limited" href="./index.php">Voltar a tela Inicial</a>
                     </div>
               </div>
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
         EOD;
   }