<script lang="ts">
	import Button from '../../components/Button.svelte';
	import Modal from '../../components/Modal.svelte';

	import { createEventDispatcher } from 'svelte';
	import SvelteMarkdown from 'svelte-markdown';
	const dispatch = createEventDispatcher();
	export let roundNumber: number;
	export let questionNumber: number;
	export let questionTitle: string;
	export let questionText: string;
	function onClose() {
		dispatch('close');
	}
</script>

<Modal>
	<h1>{questionTitle}</h1>
	<h2>Round:{roundNumber} Question: {questionNumber}</h2>
	<SvelteMarkdown source={questionText} />
	<hr />
	<Button on:click={onClose}>Close</Button>
</Modal>

<style>
</style>
