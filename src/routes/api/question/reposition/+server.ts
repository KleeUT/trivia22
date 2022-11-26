import type { RequestEvent } from '@sveltejs/kit';
import type { PlannedQuestion } from 'src/types';
import { validateRequest } from '../../requestValidator';
import { createQuestionKey } from '../utils';

export async function POST(e: RequestEvent): Promise<Response> {
	return validateRequest(e, swap);
}

async function swap({ request, platform }: RequestEvent): Promise<Response> {
	const body = (await request.json()) as {
		data: {
			questionOne: { roundNumber: number; questionNumber: number };
			questionTwo: { roundNumber: number; questionNumber: number };
		};
	};
	const store = platform.env?.QUESTION_STORE;
	if (!store) {
		return new Response(JSON.stringify({ err: { messge: 'No store' } }), { status: 500 });
	}

	const q1 = await store.get(createQuestionKey(body.data.questionOne));
	const q2 = await store.get(createQuestionKey(body.data.questionTwo));

	if (!q1 || !q2) {
		return new Response(
			JSON.stringify({
				err: {
					message: `Couldn't find questions`
				}
			})
		);
	}

	const question1 = JSON.parse(q1) as PlannedQuestion;
	const question2 = JSON.parse(q2) as PlannedQuestion;

	store.put(
		createQuestionKey(body.data.questionOne),
		JSON.stringify({
			questionNumber: body.data.questionOne.questionNumber,
			roundNumber: body.data.questionOne.roundNumber,
			question: question2.question
		})
	);
	store.put(
		createQuestionKey(body.data.questionTwo),
		JSON.stringify({
			questionNumber: body.data.questionTwo.questionNumber,
			roundNumber: body.data.questionTwo.roundNumber,
			question: question1.question
		})
	);
	return new Response(JSON.stringify({ data: {} }), { status: 200 });
}
