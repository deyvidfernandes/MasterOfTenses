import * as styling from "../styling/ExerciseComponent.js";
import { Card, FSRS as _FSRS, Rating } from "../lib/FSRS/fsrs.js";
import { generateHTMLForInputStep } from "./InputStep.js";
import { generateHTMLForCorrectionStep } from "./CorrectionStep.js";
import * as FSRSTypes from "../lib/FSRS/types.js";
import { fetchVerbData, postVerbData } from "./apiWrappers/wrappers.js";

const FSRS = new _FSRS();

const playAudioOnClick = (audio, buttonId) => {
	const button = document.getElementById(buttonId);
	button.addEventListener("click", () => {
		audio.play();
	});
};

function formatDateMySQLFormat(date = new Date()) {
	// Formata a data no formato desejado: 'YYYY-MM-DD HH:mm:ss'
	return date.toISOString().slice(0, 19).replace("T", " ");
}

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

	saveRepetitionInfo = (card) => {

		/** @type {FSRSTypes.RepetitionInfo} */
		const repetitionInfo = {
			verb_id: this.#currentVerbData.id,
			expires: formatDateMySQLFormat(cardData.due),
			stability: cardData.stability,
			difficult: cardData.difficulty,
			repetitions: cardData.reps,
			lapses: cardData.lapses,
			learning_state: cardData.state,
			last_review: formatDateMySQLFormat(),
		};

		postVerbData(repetitionInfo);
	};

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
				const buttonIndex = button.getAttribute("button-index");
				const cardData = schedulingInfo[buttonIndex].card;

				if (this.getAttribute("test") === "false") {
					saveRepetitionInfo(cardData);
				}

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
