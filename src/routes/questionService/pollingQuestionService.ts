import type { CurrentQuestion } from 'src/types';
import { onMount } from 'svelte';
import { writable } from 'svelte/store';
import { sponsorSlideQuestion } from './sponsorSlide';

async function getFromServer(
	fetchAPI: typeof fetch,
	set: (question: CurrentQuestion) => void
): Promise<void> {
	const fetchResponse = await fetchAPI('/api/currentQuestion');
	if (!fetchResponse.ok) {
		const res = await fetchResponse.text;
		console.error({ status: fetchResponse.status, res });
	}
	console.log('fetched data', fetchResponse.status);
	const body = (await fetchResponse.json()) as { data: { currentQuestion: CurrentQuestion } };
	console.log('decoded body', body);
	set(body.data.currentQuestion);
}

function poll(action: () => void) {
	setTimeout(() => {
		action();
		poll(action);
	}, 1000);
}

export function createService(fetchAPI: typeof fetch) {
	console.log('Creating store');
	const currentQuestion = writable<CurrentQuestion>(sponsorSlideQuestion);
	onMount(() => {
		poll(() => getFromServer(fetchAPI, currentQuestion.set));
	});
	const currentQuestionSubscribe = currentQuestion.subscribe;
	return {
		currentQuestionSubscribe
	};
}