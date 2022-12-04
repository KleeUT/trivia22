import type { RequestEvent } from '@sveltejs/kit';
import type { PlannedQuestion, Question } from 'src/types';
import { createQuestionKey } from '../question/utils';
import { validateRequest } from '../requestValidator';

const currentQuestionPrefix = 'currentQuestion';
const currentQuestionDelimiter = '|';
const currentQuestionKey = (time: Date) =>
	`${currentQuestionPrefix}${currentQuestionDelimiter}${time.valueOf()}`;

function addNoCacheHeader(response: Response): Response {
	try {
		const headers: Headers = response.headers || new Headers();
		headers.append('Cache-Control', 'no-cache');
		return new Response(response.body, { headers });
	} catch (e) {
		console.error(e);
		throw e;
	}
}

export async function GET({ platform }: RequestEvent): Promise<Response> {
	let rawData = 'not set';
	try {
		const keyResult = await platform.env?.QUESTION_STORE.list({ prefix: currentQuestionPrefix });
		if (!keyResult) {
			return addNoCacheHeader(
				new Response(JSON.stringify({ err: { message: 'No current question' } }), {
					status: 404
				})
			);
		}
		const keys = Array.from(keyResult.keys).map((key) => {
			return {
				key: key.name,
				time: key.name.substring(key.name.indexOf(currentQuestionDelimiter) + 1)
			};
		});
		keys.sort((a, b) => (a.time < b.time ? 1 : -1));
		const [latestKey] = keys;
		const currentQuestion = await platform.env?.QUESTION_STORE.get(latestKey.key, 'text');
		if (!currentQuestion) {
			return addNoCacheHeader(
				new Response(JSON.stringify({ err: { message: 'No current question' } }), {
					status: 404
				})
			);
		}
		rawData = currentQuestion;
		const question = JSON.parse(currentQuestion) as PlannedQuestion;
		return addNoCacheHeader(
			new Response(JSON.stringify({ data: { currentQuestion: question } }), { status: 200 })
		);
	} catch (e) {
		const err = e as Error;
		return addNoCacheHeader(
			new Response(
				JSON.stringify({ err: { message: err.message, stack: err.stack }, data: rawData }),
				{ status: 500 }
			)
		);
	}
}

async function deleteOldCurrentQuestions(platform: Readonly<App.Platform>): Promise<void> {
	const keyResult = await platform.env?.QUESTION_STORE.list({ prefix: currentQuestionPrefix });
	if (!keyResult) {
		return;
	}
	const keys = Array.from(keyResult.keys).map((key) => {
		return {
			key: key.name,
			time: key.name.substring(key.name.indexOf(currentQuestionDelimiter) + 1)
		};
	});
	keys.sort((a, b) => (a.time < b.time ? 1 : -1));
	const [_latestKey, ...rest] = keys;
	await Promise.all(
		rest.map((key) => {
			platform.env?.QUESTION_STORE.delete(key.key);
		})
	);
}

export async function PUT(e: RequestEvent): Promise<Response> {
	return await validateRequest(
		e,
		async ({ request, platform }: RequestEvent): Promise<Response> => {
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
				return addNoCacheHeader(
					new Response(
						JSON.stringify({
							err: {
								message: `no question round:${body.data.roundNumber} question:${body.data.questionNumber}`
							}
						})
					)
				);
			}

			const question = JSON.parse(q) as Question;

			await Promise.all([
				platform.env?.QUESTION_STORE.put(currentQuestionKey(new Date()), JSON.stringify(question)),
				deleteOldCurrentQuestions(platform)
			]);
			return addNoCacheHeader(
				new Response(JSON.stringify({ data: { question } }), { status: 200 })
			);
		}
	);
}
