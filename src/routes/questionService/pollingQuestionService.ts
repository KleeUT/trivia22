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
	const body = (await fetchResponse.json()) as { data: { currentQuestion: PlanedQuestion } };
	set(body.data.currentQuestion);
}

function poll(action: () => void) {
	setTimeout(() => {
		action();
		poll(action);
	}, 2500);
}

async function setNextQuestion(
	fetchAPI: typeof fetch,
	details: { roundNumber: number; questionNumber: number },
	token: string
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
async function getAllQuestions(token: string): Promise<Map<number, PlanedQuestion[]>> {
	let r = await fetch('/api/question', { headers: { Authorization: `Bearer ${token}` } });
	let j = (await r.json()) as { data: { questions: PlanedQuestion[] } };
	const questionData = j.data.questions;
	const game = questionData.reduce((p, c) => {
		const round = p.get(c.roundNumber) || [];
		round.push(c);
		p.set(c.roundNumber, round);
		return p;
	}, new Map<number, PlanedQuestion[]>());

	return game;
}

async function submitQuestion(
	token: string,
	{
		roundNumber,
		questionNumber,
		questionTitle,
		questionText
	}: {
		roundNumber: number;
		questionNumber: number;
		questionTitle: string;
		questionText: string;
	}
): Promise<void> {
	await fetch('/api/question', {
		method: 'put',
		body: JSON.stringify({
			data: {
				roundNumber,
				questionNumber,
				questionTitle,
				questionText
			}
		}),
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
}

export function createService(fetchAPI: typeof fetch) {
	const currentQuestion = writable<PlanedQuestion>(sponsorSlideQuestion);
	onMount(() => {
		poll(() => getFromServer(fetchAPI, currentQuestion.set));
	});
	const currentQuestionSubscribe = currentQuestion.subscribe;
	return {
		currentQuestionSubscribe,
		getCurrent: () => getFromServer(fetchAPI, currentQuestion.set),
		getAllQuestions,
		submitQuestion,
		setNext: (details: { roundNumber: number; questionNumber: number }, token: string) =>
			setNextQuestion(fetchAPI, details, token)
	};
}
