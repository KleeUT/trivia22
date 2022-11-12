export const createQuestionKey = ({
	roundNumber,
	questionNumber
}: {
	roundNumber: number;
	questionNumber: number;
}): string => `question|round:${roundNumber}-question:${questionNumber}`;
