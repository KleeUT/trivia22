import type { RequestEvent } from '@sveltejs/kit';

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
	const db = platform.env?.CURRENT_QUESTION_DB!;
	const stmt = db.prepare('SELECT * FROM CurrentQuestion');
	const { results, error, duration } = await stmt.all<{ id: number; question: string }>();
	if (!results || results.length === 0) {
		return addNoCacheHeader(new Response('No current question found', { status: 404 }));
	}

	results.sort((a, b) => (a.id < b.id ? 1 : -1));
	return addNoCacheHeader(
		new Response(JSON.stringify({ data: { currentQuestion: results[0].question } }), {
			status: 200
		})
	);
}
