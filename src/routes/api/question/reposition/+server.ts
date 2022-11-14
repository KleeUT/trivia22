import type { RequestEvent } from '@sveltejs/kit';
import { createQuestionKey } from '../utils';

export async function POST({ request, platform }: RequestEvent): Promise<Response> {
	const body = (await request.json()) as {
		data: {
			one: {
				roundNumber: number;
				questionNumber: number;
			};
			two: {
				roundNumber: number;
				questionNumber: number;
			};
		};
	};
	const store = platform.env?.QUESTION_STORE;
	if (!store) {
		return new Response(JSON.stringify({ err: { messge: 'No store' } }), { status: 500 });
	}

	const q1 = await store.get(createQuestionKey(body.data.one));
	const q2 = await store.get(createQuestionKey(body.data.two));

	if (!q1 || !q2) {
		return new Response(
			JSON.stringify({
				err: {
					message: `Couldn't find questions`
				}
			})
		);
	}
	store.put(createQuestionKey(body.data.one), q2);
	store.put(createQuestionKey(body.data.two), q1);
	return new Response(JSON.stringify({ data: {} }), { status: 200 });
}
