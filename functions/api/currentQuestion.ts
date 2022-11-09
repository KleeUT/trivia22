// export const onRequest: PagesFunction = ({ request }) => {
// 	const upgradeHeader = request.headers.get('Upgrade');
// 	if (!upgradeHeader || upgradeHeader !== 'websocket') {
// 		return new Response('Expected Upgrade: websocket', { status: 426 });
// 	}

// 	const webSocketPair = new WebSocketPair();
// 	const [client, server] = Object.values(webSocketPair);

// 	// server.accept();
// 	server.addEventListener('message', (event) => {
// 		console.log(event.data);
// 	});

// 	return new Response(null, {
// 		status: 101,
// 		webSocket: client
// 	});
// };

const jsonResponses = async ({ next }) => {
	const response = await next();
	response.headers.set('Content-Type', 'application/json');
	return response;
};
const corsOpen = async ({ next }) => {
	const response = await next();
	response.headers.set('Access-Control-Allow-Origin', '*');
	response.headers.set('Access-Control-Allow-Headers', '*');
	return response;
};

const onRequestGet: PagesFunction = () => {
	return new Response('OK', { status: 200 });
};

export const onRequest = [jsonResponses, corsOpen, onRequestGet];
