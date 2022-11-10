import type { RequestEvent } from '@sveltejs/kit';
import type { CurrentQuestion } from 'src/types';

export async function GET({ platform }: RequestEvent): Promise<Response> {
	let rawData = 'not set';
	try {
		const v = await platform.env?.QUESTION_STORE.get('currentQuestion', 'text');
		if (!v) {
			return new Response(JSON.stringify({ err: { message: 'No current question' } }), {
				status: 404
			});
		}
		rawData = v;
		const question = JSON.parse(v) as CurrentQuestion;
		return new Response(JSON.stringify({ data: { currentQuestion: question } }), { status: 200 });
	} catch (e) {
		const err = e as Error;
		return new Response(
			JSON.stringify({ err: { message: err.message, stack: err.stack }, data: rawData }),
			{ status: 500 }
		);
	}
}
