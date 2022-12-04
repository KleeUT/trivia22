import type { PlannedQuestion } from './types';

interface Env {}

const currentQuestionKey = 'current-question';
const sponsorSlideQuestion: PlannedQuestion = {
	roundNumber: 0,
	questionNumber: 0,
	question: {
		questionText: `
* Newy Tech People
* Galah Cyber
* ArrowTail
* Saphi engineering
    `,
		questionTitle: 'Please thank our sponsors',
		points: 0
	}
};

export class CurrentQuestionStore {
	private currentQuestion: PlannedQuestion = sponsorSlideQuestion;
	constructor(private state: DurableObjectState, private env: Env) {
		this.state.blockConcurrencyWhile(async () => {
			this.currentQuestion =
				(await this.state.storage.get(currentQuestionKey)) || sponsorSlideQuestion;
		});
	}

	async fetch(request: Request): Promise<Response> {
		if (request.method === 'PUT') {
			const requestData = await request.json();
			this.currentQuestion = requestData as PlannedQuestion;
			await this.state.storage.put(currentQuestionKey, this.currentQuestion);
		}
		return new Response(JSON.stringify(this.currentQuestion));
	}
}
