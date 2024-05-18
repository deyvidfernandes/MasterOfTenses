export const generateHTMLForExerciseEnding = () => {
   return `
   <div class="test-end-message-container">
      <div>
         <h1 id="congrats-message-title">Todas as revisões de hoje foram finalizadas</h1>
         <p>Agora você pode aproveitar para descobrir novos verbos</p>
         <a class="action-button --limited" href="./study.php?type=2">Descobrir novos verbos</a>
      </div>
   </div>
   `
}