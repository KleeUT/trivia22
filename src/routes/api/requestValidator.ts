import type { RequestEvent } from '@sveltejs/kit';
import { parseJwt } from '@cfworker/jwt';

export async function validateRequest(
	e: RequestEvent,
	next: (e: RequestEvent) => Promise<Response>
): Promise<Response> {
	const authHeader = e.request.headers.get('Authorization');
	const issuer = 'https://klee-test.au.auth0.com/';
	const audience = 'TheSweetestAPI';
	if (!authHeader) {
		return new Response('Missing auth', { status: 401 });
	}
	const result = await parseJwt(authHeader.substring('Bearer '.length), issuer, audience);
	console.log(result);
	if (!result.valid) {
		return new Response('Invalid auth', { status: 401 });
	} else {
		return next(e);
	}
}
