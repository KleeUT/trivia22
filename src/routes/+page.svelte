<script>
	import SvelteMarkdown from 'svelte-markdown';
	import { createService } from './questionService';
	let questionText = '';
	let questionTitle = '';
	let roundNumber = 0;
	let questionNumber = 0;
	let points = 0;
	const store = createService(fetch);
	store.currentQuestionSubscribe((q) => {
		questionText = q.question.questionText;
		questionTitle = q.question.questionTitle;
		roundNumber = q.roundNumber;
		questionNumber = q.questionNumber;
		points = q.question.points;
	});
	import ntplogo from '$lib/images/ntplogo.png';
	import galahlogo from '$lib/images/GalahLogo.png';
	import arrowtailLogo from '$lib/images/Arrowtail.png';
	import saphiLogo from '$lib/images/saphi.png';
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Newwwie Trivia 2022" />
</svelte:head>
<div class="main">
	<div class="images">
		<img src={ntplogo} alt="Newy Tech People Logo" />
		<img src={galahlogo} alt="Galah Cyber Logo" />
		<img src={arrowtailLogo} alt="Arrowtail logo" />
		<img src={saphiLogo} alt="Saphi logo" />
	</div>
</div>
<section>
	<h3>Round:{roundNumber} Question: {questionNumber}</h3>
	<h2>Points: {points}</h2>
	<h1>{questionTitle}</h1>
	<SvelteMarkdown source={questionText} />
</section>

<style>
	img {
		height: 10vh;
	}
	div.images {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 10vh;
	}
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}
</style>
