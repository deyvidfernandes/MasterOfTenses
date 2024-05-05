import * as APITypes from "./apiWrappers/types.js";
/**
 * Generates HTML for the correction step of an exercise component.
 *
 * @param {Object} options - The options for generating the HTML.
 * @param {string} options.simplePastInput - The value of the simple past input.
 * @param {string} options.pastParticipleInput - The value of the past participle input.
 * @param {Array<number>} options.daysForRepetition - The number of days for the "Easy" feedback button.
 * @param {APITypes.EnrichedVerbAPIFormat} options.verbData - The data for the verb.
 * @returns {string} The generated HTML for the correction step.
 */
export const generateHTMLForCorrectionStep = ({
	simplePastInput,
	pastParticipleInput,
	daysForRepetition,
	verbData,
}) => {
	/**
	 * @param {Date} date
	 * @returns {string}
	 */
	const formatRepeatDate = (date) => {
		const interval = date - new Date();
		const oneDay = 1000 * 60 * 60 * 24;
		const oneHour = 1000 * 60 * 60;
		const fifteenMinutes = 1000 * 60 * 15;
		if (interval > oneDay) {
			return `${Math.floor(interval / oneDay)}d`;
		}
		if (interval > oneHour) {
			return `${Math.floor(interval / oneHour)}h`;
		}
		return "&lt15m";
	};

	/**
	 * Generates HTML for displaying the differences between the correct string and the input string.
	 *
	 * @param {string} correct - The correct string.
	 * @param {string} input - The input string.
	 * @returns {string} - The generated HTML with highlighted differences.
	 */
	const generateHTMLForDIff = (_correct, _input) => {
		const correct = _correct.toLowerCase();
		const input = _input.toLowerCase();
		const generatedHTML = [];
		const generatedHTMLForCorrection = [];
		let missingCharacters = 0;

		for (let idx = 0; idx < input.length; idx++) {
			const char = input.split("")[idx];
			const correctChar = correct.split("")[idx + missingCharacters];
			const firstOrLastClass =
				idx === 0 ? "first" : "" || idx === correct.length - 1 ? "last" : "";

			if (!correctChar) {
				generatedHTML.push(`<span class="wrong-highlight">${char}</span>`);
				generatedHTMLForCorrection.push(`<span class="empty">-</span>`);
			} else if (char === correctChar) {
				generatedHTML.push(
					`<span class="correct-highlight ${firstOrLastClass}">${char}</span>`,
				);
				generatedHTMLForCorrection.push(
					`<span class="correct-highlight ${firstOrLastClass}">${char}</span>`,
				);
			} else {
				const missingChars = correct.substring(idx).indexOf(char);
				if (
					missingChars > 0 &&
					input.length + missingCharacters < correct.length
				) {
					for (let i = 0; i < missingChars; i++) {
						generatedHTML.push(`<span class="empty">-</span>`);
						generatedHTMLForCorrection.push(
							`<span class="corrected-highlight">${correctChar}</span>`,
						);
					}
					missingCharacters += missingChars;
					idx = idx - 1;
				} else {
					generatedHTML.push(
						`<span class="wrong-highlight ${firstOrLastClass}">${char}</span>`,
					);
					generatedHTMLForCorrection.push(
						`<span class="corrected-highlight ${firstOrLastClass}">${correctChar}</span>`,
					);
				}
			}
		}
		if (input.length + missingCharacters < correct.length) {
			for (let i = input.length; i < correct.length; i++) {
				generatedHTML.push(`<span class="empty">-</span>`);
				generatedHTMLForCorrection.push(
					`<span class="corrected-highlight">${correct.split("")[i]}</span>`,
				);
			}
		}
		return [generatedHTML.join(""), generatedHTMLForCorrection.join("")];
	};

	const formattedDaysForRepetition = daysForRepetition.map((date) => {
		return formatRepeatDate(date);
	});

	const [simplePastDiff, simplePastDiffC] = generateHTMLForDIff(
		verbData.simple_past,
		simplePastInput,
	);

	const [pastParticipleDiff, pastParticipleDiffC] = generateHTMLForDIff(
		verbData.participle,
		pastParticipleInput,
	);

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
          <p id="infinitive-word">${verbData.infinitive}</p>
      </div>
      <div id="fields-container">
          <div id="input-fields-container">
            <div class="tense-fields-container">
                <p>Simple past</p>
                <div type="text" id="simple-past-input" class="correction-display">${simplePastDiff}</div>
            </div>
            <div class="tense-fields-container">
                <p>Past participle</p>
                <div type="text" id="participle-input" class="correction-display">${pastParticipleDiff}</div>
            </div>
          </div>
          <div id="correction-fields-container">
            <div class="tense-fields-container">
                <div type="text" id="simple-past-correction" class="correction-display">${simplePastDiffC}</div>
                <button class="square-button audio-button" id="simple-past-audio">
                  <img src="static/volume-icon.svg" class="square-button_icon">
                </button>
            </div>
            <div class="tense-fields-container">
                <div type="text" id="participle-correction" class="correction-display">${pastParticipleDiffC}</div>
                <button class="square-button audio-button" id="participle-audio">
                  <img src="static/volume-icon.svg" class="square-button_icon">
                </button>
            </div>
          </div>
      </div>
    </div>

    <div id="exercise-bottom-container">
      <div>
          <p>${formattedDaysForRepetition[0]}</p>
          <button class="exercise_feedback-button"button-index="1">Repetir</button>
			 <p class="shortcut-hint">[1]</p>
      </div>
      <div>
          <p>${formattedDaysForRepetition[1]}</p>
          <button class="exercise_feedback-button"button-index="2">Difícil</button>
			 <p class="shortcut-hint">[2]</p>
      </div>
      <div>
          <p>${formattedDaysForRepetition[2]}</p>
          <button class="exercise_feedback-button"button-index="3">Bom</button>
			 <p class="shortcut-hint">[3]</p>
      </div>
      <div>
          <p>${formattedDaysForRepetition[3]}</p>
          <button class="exercise_feedback-button"button-index="4">Fácil</button>
			 <p class="shortcut-hint">[4]</p>
      </div>
    </div>
  </div>


  `;
};
