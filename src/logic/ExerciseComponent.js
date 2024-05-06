import * as styling from "../styling/ExerciseComponent.js";
import { Card, FSRS as _FSRS, Rating } from "../lib/FSRS/fsrs.js";
import { generateHTMLForInputStep } from "./InputStep.js";
import { generateHTMLForCorrectionStep } from "./CorrectionStep.js";
import * as FSRSTypes from "../lib/FSRS/types.js";
import {
	fetchVerbData,
	fetchVerbInStudy,
	postVerbRevisionData,
} from "./apiWrappers/wrappers.js";
import { constructCard } from "../lib/FSRS/helpers.js";

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

/**
 * Creates a Date object from a date and time representation.
 * @param {string} dateString The date representation in the format "YYYY-MM-DD HH:mm:ss".
 * @returns {Date} The Date object corresponding to the specified date and time.
 */
function formatMySQLFormatDate(dateString) {
	// Separating date and time
	const parts = dateString.split(" ");
	const dateParts = parts[0].split("-");
	const timeParts = parts[1].split(":");

	// Creating the Date object
	const date = new Date(
		Number.parseInt(dateParts[0]), // year
		Number.parseInt(dateParts[1]) - 1, // month (0-11)
		Number.parseInt(dateParts[2]), // day
		Number.parseInt(timeParts[0]), // hour
		Number.parseInt(timeParts[1]), // minute
		Number.parseInt(timeParts[2]), // second
	);

	return date;
}

// Cria uma classe para o Web Component
class ExerciseComponent extends HTMLElement {
	#index = 0;
	#currentVerbData;
	#currentVerbMetadata;
	#nextVerbData;
	#infinitiveAudio;
	#simplePastAudio;
	#participleAudio;
	#step = "INPUT";
	#dataFetcher;
	#dataPoster = () => {};

	// Define o conteúdo do Web Component
	async connectedCallback() {
		const saveRepetitionInfo = (cardData) => {
			/** @type {FSRSTypes.RepetitionInfo} */
			const repetitionInfo = {
				verb_id: this.#currentVerbData.id,
				expires: formatDateMySQLFormat(cardData.due),
				stability: cardData.stability,
				difficult: cardData.difficult,
				repetitions: cardData.reps,
				lapses: cardData.lapses,
				learning_state: cardData.state,
				last_review: formatDateMySQLFormat(cardData.last_review),
			};

			postVerbRevisionData(repetitionInfo);
		};

		const type = this.getAttribute("type");

		switch (type) {
			case "test":
				this.#dataFetcher = async () =>
					await fetchVerbData({
						order: "USAGE_INDEX",
						reverse: true,
						position: this.#index,
						quantity: 1,
					});
				break;
			case "exercise":
				this.#dataFetcher = async () => fetchVerbInStudy();
				this.#dataPoster = saveRepetitionInfo;
				break;
			case "discovery":
				break;
			default:
				throw new Error("Invalid type attribute");
		}

		const result = await this.#dataFetcher();
		this.#currentVerbData = result.verbData;
		this.#currentVerbMetadata = result?.metadata;
		this.renderInputStep();
	}

	async renderInputStep() {
		this.#step = "INPUT";
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
		const now = new Date();

		let newCard;
		if (this.#currentVerbMetadata) {
			const metadata = {
				...this.#currentVerbMetadata,
				due: formatMySQLFormatDate(this.#currentVerbMetadata.expires),
				last_review: formatMySQLFormatDate(
					this.#currentVerbMetadata.last_review,
				),
				state: this.#currentVerbMetadata.learning_state,
				reps: this.#currentVerbMetadata.repetitions,
			};
			metadata.elapsed_days = (new Date() - metadata.last_review) / 86400000;
			if (Number.isNaN(metadata.elapsed_days)) metadata.elapsed_days = 0;
			metadata.scheduled_days =
				(metadata.due - metadata.last_review) / 86400000;
			if (Number.isNaN(metadata.scheduled_days)) metadata.scheduled_days = 0;

			newCard = constructCard(metadata);
		} else {
			newCard = new Card();
		}
		console.log(newCard)

		const schedulingInfo = FSRS.repeat(newCard, new Date());

		const timeScheduled = [
			schedulingInfo[Rating.Again].card.due,
			schedulingInfo[Rating.Hard].card.due,
			schedulingInfo[Rating.Good].card.due,
			schedulingInfo[Rating.Easy].card.due,
		];

		const simplePastInput = document.getElementById("simple-past-input").value;
		const pastParticipleInput =
			document.getElementById("participle-input").value;

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
				this.#index++;

				const buttonIndex = button.getAttribute("button-index");
				const cardData = schedulingInfo[buttonIndex].card;
				console.log(cardData);
				// biome-ignore lint/suspicious/noDoubleEquals: <explanation>
				if (buttonIndex === "1")
					this.#dataPoster(FSRS.repeat(new Card(), now)[Rating.Again].card);
				else this.#dataPoster(cardData);

				const result = await this.#dataFetcher();
				this.#currentVerbData = result.verbData;
				this.#currentVerbMetadata = result.metadata;
				this.renderInputStep();
			});
		}
	}
}

// Define o elemento personalizado
customElements.define("exercise-component", ExerciseComponent);
