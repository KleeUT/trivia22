import type { RequestEvent } from '@sveltejs/kit';

function addNoCacheHeader(response: Response): Response {
	try {
		const headers: Headers = response.headers || new Headers();
		headers.append('Cache-Control', 'no-cache');
		return new Response(response.body, { headers, status: response.status });
	} catch (e) {
		console.error(e);
		throw e;
	}
}

export async function GET({ platform }: RequestEvent): Promise<Response> {
	try {
		const db = platform.env?.CURRENT_QUESTION_DB || platform.env?.__D1_BETA__CURRENT_QUESTION_DB!;
		const stmt = db.prepare('SELECT * FROM CurrentQuestion');
		const { results, error, duration } = await stmt.all<{ id: number; question: string }>();
		if (!results || results.length === 0) {
			return addNoCacheHeader(new Response('No current question found', { status: 404 }));
		}

		results.sort((a, b) => (a.id < b.id ? 1 : -1));
		return addNoCacheHeader(
			new Response(
				JSON.stringify({ data: { currentQuestion: results[0].question }, error, duration }),
				{
					status: 200
				}
			)
		);
	} catch (e) {
		const err = e as Error;
		return addNoCacheHeader(
			new Response(
				JSON.stringify({
					err,
					message: err.message,
					stack: err.stack,
					env: platform.env,
					ctx: platform.context
				}),
				{
					status: 500
				}
			)
		);
	}
}
