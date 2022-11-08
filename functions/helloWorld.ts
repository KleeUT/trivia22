export const onRequestPost: PagesFunction = async ({ request }) => {
	// ...
	return new Response(`Hello world ${request.method} ${request.url}`);
};
export const onRequestGet: PagesFunction = async ({ request }) => {
	// ...
	return new Response(JSON.stringify({ hello: 'world' }), {
		headers: [['Content-Type', 'application/json']]
	});
};
export const onRequestOptions: PagesFunction = async () => {
	return new Response(null, {
		headers: {
			Allow: 'GET, HEAD, POST, OPTIONS, DELETE'
		}
	});
};
