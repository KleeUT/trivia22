<script>
	import SvelteMarkdown from 'svelte-markdown';
	import { currentQuestionSubscribe } from './questionService';
	let questionText = '';
	let questionTitle = '';
	let roundNumber = 0;
	let questionNumber = 0;
	currentQuestionSubscribe((q) => {
		questionText = q.question.questionText;
		questionTitle = q.question.questionTitle;
		roundNumber = q.roundNumber;
		questionNumber = q.questionNumber;
	});
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<h1>{questionTitle}</h1>
	<h2>Round:{roundNumber} Question: {questionNumber}</h2>
	<SvelteMarkdown source={questionText} />
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}
</style>
