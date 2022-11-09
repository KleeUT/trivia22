import { RequestEvent } from "@sveltejs/kit";

export function GET(event:RequestEvent) : Response {
	return new Response('OK', { status: 200 });
};
