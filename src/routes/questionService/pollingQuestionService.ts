import type { PlannedQuestion } from 'src/types';
import { onMount } from 'svelte';
import { writable } from 'svelte/store';
import { sponsorSlideQuestion } from './sponsorSlide';

async function getFromServer(
	fetchAPI: typeof fetch,
	set: (question: PlannedQuestion) => void
): Promise<void> {
	const headers: Headers = new Headers();
	headers.append('Cache-Control', 'no-cache');
	const fetchResponse = await fetchAPI(`/api/currentQuestion/${Date.now()}`, { headers });
	if (!fetchResponse.ok || fetchResponse.status >= 400) {
		const res = await fetchResponse.text;
		console.error({ status: fetchResponse.status, res });
		return;
	}
	const body = (await fetchResponse.json()) as { data: { currentQuestion: PlannedQuestion } };
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
		}),
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
}
async function getAllQuestions(token: string): Promise<Map<number, PlannedQuestion[]>> {
	let r = await fetch('/api/question', { headers: { Authorization: `Bearer ${token}` } });
	let j = (await r.json()) as { data: { questions: PlannedQuestion[] } };
	const questionData = j.data.questions;
	const game = questionData.reduce((p, c) => {
		const round = p.get(c.roundNumber) || [];
		round.push(c);
		p.set(c.roundNumber, round);
		return p;
	}, new Map<number, PlannedQuestion[]>());

	return game;
}

async function submitQuestion(
	token: string,
	{
		roundNumber,
		questionNumber,
		questionTitle,
		questionText,
		points
	}: {
		roundNumber: number;
		questionNumber: number;
		questionTitle: string;
		questionText: string;
		points: number;
	}
): Promise<void> {
	await fetch('/api/question', {
		method: 'put',
		body: JSON.stringify({
			data: {
				roundNumber,
				questionNumber,
				questionTitle,
				questionText,
				points
			}
		}),
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
}

async function deleteQuestion(
	fetchAPI: typeof fetch,
	token: string,
	{ roundNumber, questionNumber }: { roundNumber: number; questionNumber: number }
): Promise<void> {
	await fetchAPI('/api/question', {
		method: 'delete',
		body: JSON.stringify({
			data: {
				roundNumber,
				questionNumber
			}
		}),
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
}

async function swapQuestions(
	fetchAPI: typeof fetch,
	token: string,
	{
		questionOne,
		questionTwo
	}: {
		questionOne: { roundNumber: number; questionNumber: number };
		questionTwo: { roundNumber: number; questionNumber: number };
	}
): Promise<void> {
	await fetchAPI('/api/question/reposition', {
		method: 'post',
		body: JSON.stringify({
			data: {
				questionOne,
				questionTwo
			}
		}),
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
}

export function createService(fetchAPI: typeof fetch) {
	const currentQuestion = writable<PlannedQuestion>(sponsorSlideQuestion);
	onMount(() => {
		poll(() => getFromServer(fetchAPI, currentQuestion.set));
	});
	const currentQuestionSubscribe = currentQuestion.subscribe;
	return {
		currentQuestionSubscribe,
		getCurrent: () => getFromServer(fetchAPI, currentQuestion.set),
		getAllQuestions,
		submitQuestion,
		deleteQuestion: (token: string, details: { roundNumber: number; questionNumber: number }) =>
			deleteQuestion(fetchAPI, token, details),
		setNext: (details: { roundNumber: number; questionNumber: number }, token: string) =>
			setNextQuestion(fetchAPI, details, token),
		swapQuestions: (
			token: string,
			questions: {
				questionOne: { roundNumber: number; questionNumber: number };
				questionTwo: { roundNumber: number; questionNumber: number };
			}
		) => swapQuestions(fetchAPI, token, questions)
	};
}
