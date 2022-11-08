export interface Question {
	questionText: string;
	questionTitle: string;
}
export interface Round {
	questions: { questionNumber: number; question: Question }[];
}
