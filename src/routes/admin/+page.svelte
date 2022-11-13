<script lang="ts">
	import { onMount } from 'svelte';
	import { authService } from '../../lib/auth/authService';
	import type { PlanedQuestion } from 'src/types';
	import QuestionList from './QuestionList.svelte';
	import { createService } from '../questionService';
	let userValue: Object | undefined;
	let token = 'No token yet';
	const auth = authService();
	const service = createService(fetch);
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
		await auth.loginWithRedirect();
	}
	async function logout() {
		await auth.logout();
	}
	let game = new Map<number, PlanedQuestion[]>();
	let rounds: number[] = [];
	let round = 0;
	async function getQuestions() {
		game = await service.getAllQuestions();
		rounds = Array.from(game.keys());
		setRound(round);
	}

	getQuestions();

	let questionTitle = '';
	let questionText = '';
	let roundNumber = 0;
	let questionNumber = 0;

	async function submitQuestion(e: SubmitEvent) {
		e.preventDefault();
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
	let questions: PlanedQuestion[] = [];
	function setRound(r: number): void {
		round = r;
		questions = game.get(r) || [];
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
	<QuestionList {questions} />
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
	button {
		padding: 0.5rem;
		background: white;
		border: 1px solid blue;
		color: blue;
		cursor: pointer;
	}
</style>
