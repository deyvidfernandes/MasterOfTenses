import * as styling from "../styling/ExerciseComponent.js";
import {
	Card,
	FSRS as _FSRS,
	SchedulingInfo,
	Rating,
	State,
} from "../lib/fsrs.js";

const FSRS = new _FSRS();

const currentDomain = window.location.origin;

/**
 * @enum {string}
 * @readonly
 * @typedef {Object} Order
 * @property {string} USAGE_INDEX
 * @property {string} ALPHABETICAL
 * @property {string} ID
 */

/**
 * @typedef {Object} EnrichedVerbAPIFormat
 * @property {string} infinitive
 * @property {string=} infinitive_audio
 * @property {string} simple_past
 * @property {string=} simple_past_audio
 * @property {string=} simple_past_uk
 * @property {string=} simple_past_uk_audio
 * @property {string} participle
 * @property {string=} participle_audio
 * @property {string=} participle_uk
 * @property {string=} participle_uk_audio
 * @property {number} usage_index
 * @property {string} definitions
 * @property {string} phonetics
 */

/**
 *
 * @param {Object} config
 * @param {Order} config.order
 * @param {boolean} config.reverse
 * @param {number} config.position
 * @param {number} config.quantity
 * @returns {Promise.<EnrichedVerbAPIFormat>}
 */

const fetchVerbData = async (config) => {
	const { order, reverse, position, quantity } = config;

	const url = new URL(`${currentDomain}/MasterOfTenses/server/api/verb.php`);

	url.searchParams.append("order", order);

	if (reverse) url.searchParams.append("reverse", reverse);

	if (position) url.searchParams.append("position", position);
	else url.searchParams.append("position", 0);

	if (quantity) url.searchParams.append("quantity", quantity);
	else url.searchParams.append("quantity", 1);

	const res = await fetch(url);
	return (await res.json())[0];
};

const playAudioOnClick = (audio, buttonId) => {
	const button = document.getElementById(buttonId);
	button.addEventListener("click", () => {
		audio.play();
	});
};

/**
 * @param {EnrichedVerbAPIFormat} verbData
 * @returns {string}
 */
const generateHTMLForInputStep = (verbData) => {
	const { infinitive} = verbData;

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

/**
 * Generates HTML for the correction step of an exercise component.
 *
 * @param {Object} options - The options for generating the HTML.
 * @param {string} options.simplePastInput - The value of the simple past input.
 * @param {string} options.pastParticipleInput - The value of the past participle input.
 * @param {Array<number>} options.daysForRepetition - The number of days for the "Easy" feedback button.
 * @param {EnrichedVerbAPIFormat} options.verbData - The data for the verb.
 * @returns {string} The generated HTML for the correction step.
 */
const generateHTMLForCorrectionStep = ({
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
      </div>
      <div>
          <p>${formattedDaysForRepetition[1]}</p>
          <button class="exercise_feedback-button"button-index="2">Difícil</button>
      </div>
      <div>
          <p>${formattedDaysForRepetition[2]}</p>
          <button class="exercise_feedback-button"button-index="3">Bom</button>
      </div>
      <div>
          <p>${formattedDaysForRepetition[3]}</p>
          <button class="exercise_feedback-button"button-index="4">Fácil</button>
      </div>
    </div>
  </div>


  `;
};

// Cria uma classe para o Web Component
class ExerciseComponent extends HTMLElement {
	#index = 0;
	#currentVerbData;
	#nextVerbData;
	#infinitiveAudio;
	#simplePastAudio;
	#participleAudio;
	#step = "INPUT";

	// Define o conteúdo do Web Component
	async connectedCallback() {
		const isTest = this.getAttribute("test");

		if (isTest) {
			this.#currentVerbData = await fetchVerbData({
				order: "USAGE_INDEX",
				reverse: true,
				position: 0,
				quantity: 1,
			});
		}

		this.renderInputStep();
	}

	async renderInputStep() {
		this.#step = "INPUT";
		console.log(this.#currentVerbData);
		const { infinitive_audio, participle_audio, simple_past_audio } =
			this.#currentVerbData;

		// Se não houver um recurso de áudio, cria um áudio vazio para evitar que o áudio anterior seja tocado
		if (infinitive_audio) this.#infinitiveAudio = new Audio(infinitive_audio);
		else this.#infinitiveAudio = new Audio();
		if (participle_audio) this.#participleAudio = new Audio(participle_audio);
		else this.#participleAudio = new Audio();
		if (simple_past_audio) this.#simplePastAudio = new Audio(simple_past_audio);
		else this.#simplePastAudio = new Audio();

		this.innerHTML = generateHTMLForInputStep(this.#currentVerbData);

		styling.applyExerciseComponentStyling();

		playAudioOnClick(this.#infinitiveAudio, "infinitive-audio-button");

		const showAnswersButton = document.getElementById("show-answers-button");

		showAnswersButton.addEventListener("click", () => {
			this.renderCorrectionStep();
		});
	}

	async renderCorrectionStep() {
		this.#step = "CORRECTION";
		const newCard = new Card();
		const now = new Date();

		const simplePastInput = document.getElementById("simple-past-input").value;
		const pastParticipleInput =
			document.getElementById("participle-input").value;

		const schedulingInfo = FSRS.repeat(newCard, now);

		const timeScheduled = [
			schedulingInfo[Rating.Again].card.due,
			schedulingInfo[Rating.Hard].card.due,
			schedulingInfo[Rating.Good].card.due,
			schedulingInfo[Rating.Easy].card.due,
		];

		this.innerHTML = generateHTMLForCorrectionStep({
			simplePastInput,
			pastParticipleInput,
			daysForRepetition: timeScheduled,
			verbData: this.#currentVerbData,
		});

		styling.applyExerciseComponentCorrectionStepStyling();

		playAudioOnClick(this.#infinitiveAudio, "infinitive-audio-button");
		playAudioOnClick(this.#participleAudio, "participle-audio");
		playAudioOnClick(this.#simplePastAudio, "simple-past-audio");

		const exerciseFeedbackButtons = document.getElementsByClassName(
			"exercise_feedback-button",
		);
		for (const button of exerciseFeedbackButtons) {
			const goToNextVerb = (event) => {
				if (
					event.key === button.getAttribute("button-index") &&
					this.#step === "CORRECTION"
				) {
					button.click();
					this.#step = "INPUT";
				}
			};
			const isFirstExercise = this.#index === 0;
			if (isFirstExercise) document.addEventListener("keydown", goToNextVerb);

			button.addEventListener("click", async () => {
				this.#nextVerbData = await fetchVerbData({
					order: "USAGE_INDEX",
					reverse: true,
					position: ++this.#index,
					quantity: 1,
				});
				this.#currentVerbData = this.#nextVerbData;
				this.renderInputStep();
			});
		}
	}
}

// Define o elemento personalizado
customElements.define("exercise-component", ExerciseComponent);
