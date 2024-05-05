import * as APITypes from "./apiWrappers/types.js";

/**
 * @param {APITypes.EnrichedVerbAPIFormat} verbData
 * @returns {string}
 */
export const generateHTMLForInputStep = (verbData) => {
	const { infinitive } = verbData;

	return `
    <div id="exercise-component">
      <div id="exercise-top-container">
        <div id="infinitive-container">
            <div id="aside-buttons-container">
              <button class="square-button audio-button" id="infinitive-audio-button">
                  <img src="static/volume-icon.svg" class="square-button_icon">
              </button>
              <button class="square-button" id="dictionary-button">
                  <img src="static/book-icon.svg" class="square-button_icon">
              </button>
            </div>
            <p id="infinitive-word">${infinitive}</p>
        </div>
        <div id="fields-container">
          <div id="input-fields-container">
            <div class="tense-fields-container">
                <p>Simple past</p>
                <input type="text" id="simple-past-input" autocomplete="off">
            </div>
            <div class="tense-fields-container">
                <p>Past participle</p>
                <input type="text" id="participle-input" autocomplete="off">
            </div>
          </div>
      </div>
    </div>
    <div id="exercise-bottom-container">
      <button id="show-answers-button">Mostrar respostas</button>
    </div>
  </div>
  `;
};
