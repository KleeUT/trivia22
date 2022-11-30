export interface PlannedQuestion {
	question: Question;
	roundNumber: number;
	questionNumber: number;
}
export interface Question {
	questionText: string;
	questionTitle: string;
	points: number;
}
