import type { RequestEvent } from '@sveltejs/kit';
import type { PlanedQuestion, Question } from 'src/types';
import { createQuestionKey } from '../question/utils';

const currentQuestionKey = 'currentQuestion';
export async function GET({ platform }: RequestEvent): Promise<Response> {
	let rawData = 'not set';
	try {
		const v = await platform.env?.QUESTION_STORE.get(currentQuestionKey, 'text');
		if (!v) {
			return new Response(JSON.stringify({ err: { message: 'No current question' } }), {
				status: 404
			});
		}
		rawData = v;
		const question = JSON.parse(v) as PlanedQuestion;
		console.log(question);
		return new Response(JSON.stringify({ data: { currentQuestion: question } }), { status: 200 });
	} catch (e) {
		const err = e as Error;
		return new Response(
			JSON.stringify({ err: { message: err.message, stack: err.stack }, data: rawData }),
			{ status: 500 }
		);
	}
}

export async function PUT({ request, platform }: RequestEvent): Promise<Response> {
	const body = (await request.json()) as {
		data: {
			roundNumber: number;
			questionNumber: number;
		};
	};
	const q = await platform.env?.QUESTION_STORE.get(
		createQuestionKey({
			roundNumber: body.data.roundNumber,
			questionNumber: body.data.questionNumber
		}),
		'text'
	);
	if (!q) {
		return new Response(
			JSON.stringify({
				err: {
					message: `no question round:${body.data.roundNumber} question:${body.data.questionNumber}`
				}
			})
		);
	}
	const question = JSON.parse(q) as Question;
	// const newPlanedQuestion: PlanedQuestion = {
	// 	question,
	// 	roundNumber: body.data.roundNumber,
	// 	questionNumber: body.data.questionNumber
	// };
	platform.env?.QUESTION_STORE.put(currentQuestionKey, JSON.stringify(question));
	return new Response(JSON.stringify({ data: { question } }), { status: 200 });
}
