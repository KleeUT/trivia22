<script lang="ts">
	import SvelteMarkdown from 'svelte-markdown';
	import { createService } from '../../questionService';
	import RoundControls from './RoundControls.svelte';
	let questionText = '';
	let questionTitle = '';
	let roundNumber = 0;
	let questionNumber = 0;
	const questionService = createService(fetch);
	questionService.currentQuestionSubscribe((q) => {
		console.log('updating current', { q }, { question: q.question });
		questionText = q.question.questionText;
		questionTitle = q.question.questionTitle;
		roundNumber = q.roundNumber;
		questionNumber = q.questionNumber;
		console.log({ questionText, questionNumber, questionTitle, roundNumber, question: q.question });
	});
</script>

<RoundControls round={roundNumber} question={questionNumber} {questionService} />

<hr />
<h1>{questionTitle}</h1>
<h2>Round:{roundNumber} Question: {questionNumber}</h2>
<SvelteMarkdown source={questionText} />
