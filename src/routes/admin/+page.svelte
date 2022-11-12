<script lang="ts">
	import { onMount } from 'svelte';
	import { authService } from '../../lib/auth/authService';
	import type { PlanedQuestion, Question } from 'src/types';
	import { get } from 'svelte/store';
	let userValue: Object | undefined;
	let token = 'No token yet';
	const auth = authService();

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
	let game = new Map<number, PlanedQuestion[]>();
	let rounds: number[] = [];
	async function getQuestions() {
		let r = await fetch('/api/question');
		let j = (await r.json()) as { data: { questions: PlanedQuestion[] } };
		const questionData = j.data.questions;
		game = questionData.reduce((p, c) => {
			const round = p.get(c.roundNumber) || [];
			round.push(c);
			p.set(c.roundNumber, round);
			return p;
		}, new Map<number, PlanedQuestion[]>());

		rounds = Array.from(game.keys());
	}

	getQuestions();

	let questionTitle = '';
	let questionText = '';
	let roundNumber = 0;
	let questionNumber = 0;

	async function submitQuestion(e: SubmitEvent) {
		e.preventDefault();
		console.log('Submitting', {
			data: {
				roundNumber,
				questionNumber,
				questionTitle,
				questionText
			}
		});
		await fetch('/api/question', {
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
	let round = 0;
	function questionForRound(round: number): PlanedQuestion[] {
		return game.get(round) || [];
	}
	function setRound(r: number): void {
		round = r;
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
			<input class="full-width" type="text" bind:value={questionTitle} />
		</label>
		<label>
			Text
			<textarea class="full-width" bind:value={questionText} />
		</label>
		<button type="submit">Add</button>
	</form>
	<hr />
	{#each rounds as round}
		<button on:click={() => setRound(round)}>{round}</button>
	{/each}
	{#each questionForRound(round) as question}
		<div>
			<h3>{question.question.questionTitle}</h3>
			<pre>{question.question.questionText}</pre>
		</div>
	{/each}
</main>

<style>
	label {
		display: block;
	}
	.full-width {
		width: 100%;
	}
	textarea {
		height: 10rem;
	}
</style>
