import * as APITypes from "./types.js";
import * as FSRSTypes from "../../lib/FSRS/types.js";
const currentDomain = window.location.origin;

/**
 *
 * @param {Object} config
 * @param {APITypes.Order} config.order
 * @param {boolean} config.reverse
 * @param {number} config.position
 * @param {number} config.quantity
 * @returns {Promise.<APITypes.EnrichedVerbAPIFormat}>}
 */
export const fetchVerbData = async (config) => {
	const { order, reverse, position, quantity } = config;

	const url = new URL(
		`${currentDomain}/MasterOfTenses/server/api/public/verb.php`,
	);

	url.searchParams.append("order", order);

	if (reverse) url.searchParams.append("reverse", reverse);

	if (position) url.searchParams.append("position", position);
	else url.searchParams.append("position", 0);

	if (quantity) url.searchParams.append("quantity", quantity);
	else url.searchParams.append("quantity", 1);

	const res = await fetch(url);
	return {verbData: (await res.json())[0]};
};

/**
 *
 * @param {FSRSTypes.RepetitionInfo} repetitionInfo
 * @returns void
 */
export const postVerbRevisionData = (repetitionInfo) => {
	const url = new URL(
		`${currentDomain}/MasterOfTenses/server/api/user/verb.php`,
	);
	fetch(url, {
		method: "POST",
		body: JSON.stringify(repetitionInfo),
		headers: {
			"Content-Type": "application/json",
		},
	});
};

/**
 * @returns {object}
 * @param {APITypes.EnrichedVerbAPIFormat} verbData
 * @param {FSRSTypes.RepetitionInfo} metadata
 */
export const fetchVerbInStudy = async () => {
	const url = new URL(
		`${currentDomain}/MasterOfTenses/server/api/user/verb.php`,
	);
	const res = await fetch(url);
	return await res.json();
};

export const Types = {};
