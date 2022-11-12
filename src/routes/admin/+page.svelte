<script lang="ts">
	import { onMount } from 'svelte';
	import { authService } from '../../lib/auth/authService';
	import type { PlanedQuestion, Question } from 'src/types';
	let userValue: Object | undefined;
	let token = 'No token yet';
	const auth = authService();
	let questions: PlanedQuestion[] = [];
	auth.user.subscribe((u) => {
		userValue = u;
	});
	auth.token.subscribe((t) => {
		token = t;
	});
	onMount(async () => {
		await auth.handleRedirect();
	});
	async function login() {
		console.log('login');
		await auth.loginWithRedirect();
	}
	async function logout() {
		await auth.logout();
	}
	async function getQuestions() {
		let r = await fetch('/api/question');
		let j = (await r.json()) as { data: { questions: PlanedQuestion[] } };
		const questionData = j.data.questions;
		questionData.sort((a, b) => {
			if (a.roundNumber === b.roundNumber) {
				if (a.questionNumber <= b.questionNumber) {
					return -1;
				} else {
					return 1;
				}
			}
			if (a.roundNumber < b.roundNumber) {
				return -1;
			}
			return 1;
		});
		questions = questionData;
	}
	getQuestions();

	let questionTitle = '';
	let questionText = '';
	let roundNumber = 0;
	let questionNumber = 0;

	async function submitQuestion(e: SubmitEvent) {
		e.preventDefault();
		await fetch('/api/quetion', {
			method: 'put',
			body: JSON.stringify({
				data: {
					roundNumber,
					questionNumber,
					questionTitle,
					questionText
				}
			})
		});
		await getQuestions();
	}
</script>

<main>
	<h1>Admin</h1>
	<button on:click={login}>Login</button>
	<button on:click={logout}>Logout</button>
	<pre>{JSON.stringify(userValue)}</pre>
	<pre>{token}</pre>
	<hr />
	<form on:submit={submitQuestion}>
		<label>
			Round:
			<input type="number" bind:value={roundNumber} />
		</label>
		<label>
			Question Number:
			<input type="number" bind:value={questionNumber} />
		</label>
		<label>
			Title:
			<input type="number" bind:value={questionTitle} />
		</label>
		<label>
			Text
			<input type="number" bind:value={questionText} />
		</label>
	</form>
	<hr />
	{#each questions as question}
		<div>
			<h2>Round {question.roundNumber} Question {question.questionNumber}</h2>
			<h3>{question.question.questionTitle}</h3>
			<pre>{question.question.questionText}</pre>
		</div>
	{/each}
</main>
