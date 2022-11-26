import type { RequestEvent } from '@sveltejs/kit';
import type { PlannedQuestion, Question } from 'src/types';
import { validateRequest } from '../requestValidator';
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
			const newPlannedQuestion: PlannedQuestion = {
				question: { questionText, questionTitle },
				roundNumber,
				questionNumber
			};
			await platform.env?.QUESTION_STORE.put(
				createQuestionKey({ questionNumber, roundNumber }),
				JSON.stringify(newPlannedQuestion)
			);
			return new Response(JSON.stringify({ data: { newPlannedQuestion } }), { status: 200 });
		}
	);
}

export async function DELETE(e: RequestEvent): Promise<Response> {
	return await validateRequest(
		e,
		async ({ request, platform }: RequestEvent): Promise<Response> => {
			const body = (await request.json()) as {
				data: {
					roundNumber: number;
					questionNumber: number;
				};
			};
			await platform.env?.QUESTION_STORE.delete(
				createQuestionKey({
					roundNumber: body.data.roundNumber,
					questionNumber: body.data.questionNumber
				})
			);

			return new Response(JSON.stringify({ data: {} }), { status: 200 });
		}
	);
}
