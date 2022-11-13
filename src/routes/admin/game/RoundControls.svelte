<script lang="ts">
	import type { createService } from 'src/routes/questionService';
	import type { PlanedQuestion } from 'src/types';
	import { onMount } from 'svelte';

	export let round = 0;
	export let question = 0;
	export let questionService: ReturnType<typeof createService>;
	let allQuestions: Map<number, PlanedQuestion[]> = new Map();
	onMount(async () => {
		allQuestions = await questionService.getAllQuestions();
	});
	$: questionsInRound = allQuestions.get(round)?.length;
	function next() {
		questionService.setNext({ roundNumber: round, questionNumber: question + 1 });
	}
	function previous() {
		if (question === 0) {
			return;
		}
		questionService.setNext({ roundNumber: round, questionNumber: question - 1 });
	}
	let changeRound: number = 0;
	function setRound(e: SubmitEvent) {
		e.preventDefault();
		questionService.setNext({ roundNumber: changeRound, questionNumber: 0 });
	}
	function sponsorSlide() {
		questionService.setNext({ roundNumber: 0, questionNumber: 0 });
	}
</script>

<div class="control-block">
	<form on:submit={setRound}>
		<input type="text" bind:value={round} />
		<button type="submit">Set</button>
		<button type="button" class="large" on:click={sponsorSlide}>Sponsor</button>
	</form>
</div>
<hr />
<div class="control-block">
	<button on:click={previous}>Prev</button>
	<button class="large" on:click={next}>Next</button>
</div>
<div>
	<p>Round: {round} - {question} / {questionsInRound}</p>
</div>

<style>
	form {
		display: block;
	}
	input {
		display: block;
	}
	.control-block {
		padding: 1rem;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1rem;
	}
	button {
		background: white;
		border: 1px solid blue;
		color: blue;
		cursor: pointer;
		border-radius: 3px;
	}
	button.large {
		padding: 1rem;
		border: 2px solid blue;
	}
</style>
