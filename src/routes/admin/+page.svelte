<script lang="ts">
	import { onMount } from 'svelte';
	import { authService } from '../../lib/auth/authService';
	import type { PlanedQuestion } from 'src/types';
	import QuestionList from './QuestionList.svelte';
	import { createService } from '../questionService';
	import Button from '../../components/Button.svelte';
	import EditQuestion from './EditQuestion.svelte';
	import PreviewQuestion from './PreviewQuestion.svelte';
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
		console.log('Mount ');
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
		game = await service.getAllQuestions(token);
		rounds = Array.from(game.keys());
		setRound(round);
	}

	getQuestions();

	async function submitQuestion() {
		await service.submitQuestion(token, {
			roundNumber: selectedRoundNumber,
			questionNumber: selectedQuestionNumber,
			questionTitle: selectedQuestionTitle,
			questionText: selectedQuestionText
		});
		await getQuestions();
		editOpen = false;
	}
	let questions: PlanedQuestion[] = [];
	function setRound(r: number): void {
		round = r;
		questions = game.get(r) || [];
	}
	let editOpen = false;

	let previewOpen = false;
	let selectedRoundNumber = 0;
	let selectedQuestionNumber = 0;
	let selectedQuestionTitle = '';
	let selectedQuestionText = '';

	function openEdit(e: CustomEvent<PlanedQuestion>) {
		const question = e.detail;
		selectedRoundNumber = question.roundNumber;
		selectedQuestionNumber = question.questionNumber;
		selectedQuestionTitle = question.question.questionTitle;
		selectedQuestionText = question.question.questionText;
		editOpen = true;
	}
	function openPreview(e: CustomEvent<PlanedQuestion>) {
		const question = e.detail;
		selectedRoundNumber = question.roundNumber;
		selectedQuestionNumber = question.questionNumber;
		selectedQuestionTitle = question.question.questionTitle;
		selectedQuestionText = question.question.questionText;
		previewOpen = true;
	}
	function openNew(e: CustomEvent<PlanedQuestion>) {
		const round = Math.max(game.size - 1, 0);
		selectedRoundNumber = round;
		selectedQuestionNumber = game.get(round)?.length || 0;
		selectedQuestionTitle = '';
		selectedQuestionText = '';
		editOpen = true;
	}
</script>

<main>
	<h1>Admin</h1>
	{#if token}
		<Button on:click={logout}>Logout</Button>
	{:else}
		<Button on:click={login}>Login</Button>
	{/if}
	<hr />
	<Button on:click={openNew}>New</Button>
	<hr />
	{#each rounds as round}
		<Button on:click={() => setRound(round)}>{round}</Button>
	{/each}
	<QuestionList {questions} on:preview={openPreview} on:edit={openEdit} />
</main>
{#if editOpen}
	<EditQuestion
		bind:roundNumber={selectedRoundNumber}
		bind:questionNumber={selectedQuestionNumber}
		bind:questionTitle={selectedQuestionTitle}
		bind:questionText={selectedQuestionText}
		on:close={() => (editOpen = false)}
		on:save={() => submitQuestion()}
	/>
{:else if previewOpen}
	<PreviewQuestion
		on:close={() => (previewOpen = false)}
		roundNumber={selectedRoundNumber}
		questionNumber={selectedQuestionNumber}
		questionTitle={selectedQuestionTitle}
		questionText={selectedQuestionText}
	/>
{/if}

<style>
</style>
