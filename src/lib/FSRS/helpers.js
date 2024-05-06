export const constructCard = ({
	due,
	stability,
	difficult,
	elapsed_days,
	scheduled_days,
	reps,
	lapses,
	state,
	last_review,
}) => {
	return {
		due: due,
		stability: stability,
		difficult: difficult,
		elapsed_days: elapsed_days,
		scheduled_days: scheduled_days,
		reps: reps,
		lapses: lapses,
		state: state,
		last_review: last_review,
	};
};
