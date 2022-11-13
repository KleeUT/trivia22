import type { PlanedQuestion } from 'src/types';
import { onMount } from 'svelte';
import { writable } from 'svelte/store';
import { sponsorSlideQuestion } from './sponsorSlide';

async function getFromServer(
	fetchAPI: typeof fetch,
	set: (question: PlanedQuestion) => void
): Promise<void> {
	const fetchResponse = await fetchAPI('/api/currentQuestion');
	if (!fetchResponse.ok || fetchResponse.status >= 400) {
		const res = await fetchResponse.text;
		console.error({ status: fetchResponse.status, res });
		return;
	}
	console.log('fetched data', fetchResponse.status, fetchResponse.ok);
	const body = (await fetchResponse.json()) as { data: { currentQuestion: PlanedQuestion } };
	console.log('decoded body', body);
	set(body.data.currentQuestion);
}

function poll(action: () => void) {
	setTimeout(() => {
		action();
		poll(action);
	}, 5000);
}

async function setNextQuestion(
	fetchAPI: typeof fetch,
	details: { roundNumber: number; questionNumber: number }
): Promise<void> {
	await fetchAPI('/api/currentQuestion', {
		method: 'PUT',
		body: JSON.stringify({
			data: {
				roundNumber: details.roundNumber,
				questionNumber: details.questionNumber
			}
		})
	});
}

export function createService(fetchAPI: typeof fetch) {
	console.log('Creating store');
	const currentQuestion = writable<PlanedQuestion>(sponsorSlideQuestion);
	onMount(() => {
		poll(() => getFromServer(fetchAPI, currentQuestion.set));
	});
	const currentQuestionSubscribe = currentQuestion.subscribe;
	return {
		currentQuestionSubscribe,
		getCurrent: () => getFromServer(fetchAPI, currentQuestion.set),
		setNext: (details: { roundNumber: number; questionNumber: number }) =>
			setNextQuestion(fetchAPI, details)
	};
}
