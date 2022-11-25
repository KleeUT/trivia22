<script lang="ts">
	import { authService } from '$lib/auth/authService';
	import SvelteMarkdown from 'svelte-markdown';
	import { createService } from '../../questionService';
	import RoundControls from './RoundControls.svelte';
	let auth = authService();
	let token = '';
	auth.token.subscribe((t) => {
		token = t;
	});
	let questionText = '';
	let questionTitle = '';
	let roundNumber = 0;
	let questionNumber = 0;
	const questionService = createService(fetch);
	questionService.currentQuestionSubscribe((q) => {
		questionText = q.question.questionText;
		questionTitle = q.question.questionTitle;
		roundNumber = q.roundNumber;
		questionNumber = q.questionNumber;
	});
</script>

<RoundControls round={roundNumber} question={questionNumber} {questionService} {token} />

<hr />
<h1>{questionTitle}</h1>
<h2>Round:{roundNumber} Question: {questionNumber}</h2>
<SvelteMarkdown source={questionText} />
