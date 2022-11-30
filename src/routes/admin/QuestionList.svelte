<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Button from '../../components/Button.svelte';
	import type { PlannedQuestion } from 'src/types';
	const dispatcher = createEventDispatcher();

	export let questions: PlannedQuestion[] = [];
	let roundNumber = -1;
	$: roundNumber = (questions[0] || { roundNumber: -1 }).roundNumber;
	const onEdit = (question: PlannedQuestion) => dispatcher('edit', question);
	const onPreview = (question: PlannedQuestion) => dispatcher('preview', question);
	const onDelete = (question: PlannedQuestion) => dispatcher('delete', question);
	const moveUp = (question: PlannedQuestion) => dispatcher('moveUp', question);
	const moveDown = (question: PlannedQuestion) => dispatcher('moveDown', question);
</script>

<h2>{roundNumber}</h2>
{#each questions as question}
	<div>
		<h3>
			[{question.question.points}] {question.questionNumber} - {question.question.questionTitle}
		</h3>
		<Button on:click={() => onEdit(question)}>Edit</Button>
		<Button on:click={() => onPreview(question)}>Preview</Button>
		<Button on:click={() => onDelete(question)}>{' - '}</Button>
		<Button on:click={() => moveUp(question)} disabled={question.questionNumber === 0}>Up</Button>
		<Button
			on:click={() => moveDown(question)}
			disabled={question.questionNumber === questions.length - 1}>Down</Button
		>
	</div>
{/each}

<style>
	h3 {
		display: inline-block;
	}
</style>
