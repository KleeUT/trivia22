<script lang="ts">
	import type { createService } from 'src/routes/questionService';
	import type { PlanedQuestion } from 'src/types';
	import { onMount } from 'svelte';
	import Button from '../../../components/Button.svelte';
	export let round = 0;
	export let question = 0;
	export let questionService: ReturnType<typeof createService>;
	export let token: string;
	let allQuestions: Map<number, PlanedQuestion[]> = new Map();
	onMount(async () => {
		allQuestions = await questionService.getAllQuestions(token);
	});
	$: questionsInRound = allQuestions.get(round)?.length;
	function next() {
		questionService.setNext({ roundNumber: round, questionNumber: question + 1 }, token);
	}
	function previous() {
		if (question === 0) {
			return;
		}
		questionService.setNext({ roundNumber: round, questionNumber: question - 1 }, token);
	}
	let changeRound: number = 0;
	function setRound(e: SubmitEvent) {
		e.preventDefault();
		questionService.setNext({ roundNumber: changeRound, questionNumber: 0 }, token);
	}
	function sponsorSlide() {
		questionService.setNext({ roundNumber: 0, questionNumber: 0 }, token);
	}
</script>

<div class="control-block">
	<form on:submit={setRound}>
		<input type="text" bind:value={round} />
		<Button type="submit">Set</Button>
		<Button type="button" size="large" on:click={sponsorSlide}>Sponsor</Button>
	</form>
</div>
<hr />
<div class="control-block">
	<Button on:click={previous}>Prev</Button>
	<Button size="large" on:click={next}>Next</Button>
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
</style>
