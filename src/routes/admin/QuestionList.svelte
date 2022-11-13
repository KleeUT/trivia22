<script lang="ts">
	import type { PlanedQuestion } from 'src/types';
	export let questions: PlanedQuestion[] = [];
	let roundNumber = -1;
	$: roundNumber = (questions[0] || { roundNumber: -1 }).roundNumber;
</script>

<h2>{roundNumber}</h2>
{#each questions as question}
	<div>
		<h3>{question.questionNumber} - {question.question.questionTitle}</h3>
		<pre>{question.question.questionText}</pre>
	</div>
{/each}
