<script lang="ts">
	import { authService } from '$lib/auth/authService';
	import Button from '../../../components/Button.svelte';
	import Modal from '../../../components/Modal.svelte';
	import type { PlanedQuestion } from 'src/types';
	import { onMount } from 'svelte';
	import SvelteMarkdown from 'svelte-markdown';
	import { createService } from '../../questionService';
	import RoundControls from './RoundControls.svelte';
	const auth = authService();
	const questionService = createService(fetch);
	let allQuestions: Map<number, PlanedQuestion[]> = new Map();

	let token = '';
	auth.token.subscribe((t) => {
		token = t;
	});
	let questionText = '';
	let questionTitle = '';
	let roundNumber = 0;
	let questionNumber = 0;
	questionService.currentQuestionSubscribe((q) => {
		questionText = q.question.questionText;
		questionTitle = q.question.questionTitle;
		roundNumber = q.roundNumber;
		questionNumber = q.questionNumber;
	});

	onMount(async () => {
		allQuestions = await questionService.getAllQuestions(token);
	});

	function next() {
		questionService.setNext({ roundNumber, questionNumber: questionNumber + 1 }, token);
	}
	function previous() {
		if (questionNumber === 0) {
			return;
		}
		questionService.setNext({ roundNumber, questionNumber: questionNumber - 1 }, token);
	}
	let roundViewOpen = false;
	function setRound(e: CustomEvent<number>) {
		questionService.setNext({ roundNumber: e.detail, questionNumber: 0 }, token);
		roundViewOpen = true;
	}
</script>

<RoundControls allRounds={Array.from(allQuestions.keys())} on:roundSet={setRound} />
{#if roundViewOpen}
	<Modal>
		<div class="control-block">
			<Button on:click={previous}>Prev</Button>
			<Button size="large" on:click={next}>Next</Button>
		</div>
		<hr />
		<h1>{questionTitle}</h1>
		<h2>Round:{roundNumber} Question: {questionNumber}</h2>
		<SvelteMarkdown source={questionText} />
		<hr />
		<Button on:click={() => (roundViewOpen = false)}>Close</Button>
	</Modal>
{/if}

<style>
	.control-block {
		padding: 1rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
	}
</style>
