<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Button from '../../components/Button.svelte';
	import type { PlanedQuestion } from 'src/types';
	const dispatcher = createEventDispatcher();

	export let questions: PlanedQuestion[] = [];
	let roundNumber = -1;
	$: roundNumber = (questions[0] || { roundNumber: -1 }).roundNumber;
	const onEdit = (question: PlanedQuestion) => dispatcher('edit', question);
	const onPreview = (question: PlanedQuestion) => dispatcher('preview', question);
</script>

<h2>{roundNumber}</h2>
{#each questions as question}
	<div>
		<h3>{question.questionNumber} - {question.question.questionTitle}</h3>
		<Button on:click={() => onEdit(question)}>Edit</Button>
		<Button on:click={() => onPreview(question)}>Preview</Button>
	</div>
{/each}

<style>
	h3 {
		display: inline-block;
	}
</style>
