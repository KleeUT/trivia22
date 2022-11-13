export const questionPrefix = 'question|';
export const createQuestionKey = ({
	roundNumber,
	questionNumber
}: {
	roundNumber: number;
	questionNumber: number;
}): string => `${questionPrefix}round:${roundNumber}-question:${questionNumber}`;
