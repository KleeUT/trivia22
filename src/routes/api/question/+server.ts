import type { RequestEvent } from '@sveltejs/kit';
import type { PlanedQuestion, Question } from 'src/types';
import { createQuestionKey, questionPrefix } from './utils';

export const GET = async ({ platform }: RequestEvent): Promise<Response> => {
	const store = platform.env?.QUESTION_STORE;
	if (!store) {
		return new Response(JSON.stringify({ err: { messge: 'No store' } }), { status: 500 });
	}
	const keys = await store.list({ prefix: questionPrefix });
	let questions: Question[] = await Promise.all(
		keys.keys.map(async (key) => {
			const questionString = await store.get(key.name);
			return JSON.parse(questionString!) as Question;
		})
	);
	return new Response(JSON.stringify({ data: { questions } }));
};

function validateRequest(
	e: RequestEvent,
	next: (e: RequestEvent) => Promise<Response>
): Promise<Response> {
	return next(e);
}

export async function PUT(e: RequestEvent): Promise<Response> {
	return await validateRequest(
		e,
		async ({ request, platform }: RequestEvent): Promise<Response> => {
			const body = (await request.json()) as {
				data: {
					roundNumber: number;
					questionNumber: number;
					questionTitle: string;
					questionText: string;
				};
			};
			const { questionText, questionTitle, roundNumber, questionNumber } = body.data;
			const newPlanedQuestion: PlanedQuestion = {
				question: { questionText, questionTitle },
				roundNumber,
				questionNumber
			};
			await platform.env?.QUESTION_STORE.put(
				createQuestionKey({ questionNumber, roundNumber }),
				JSON.stringify(newPlanedQuestion)
			);
			return new Response(JSON.stringify({ data: { newPlanedQuestion } }), { status: 200 });
		}
	);
}
