<script lang="ts">
	import Button from '../../components/Button.svelte';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let roundNumber: number;
	export let questionNumber: number;
	export let questionTitle: string;
	export let questionText: string;

	function onClose() {
		dispatch('close');
	}
	function onSublmit(e: SubmitEvent) {
		e.preventDefault();
		onSave();
	}
	function onSave() {
		dispatch('save');
	}
</script>

<div class="modal">
	<div class="content">
		<form on:submit={onSublmit}>
			<label>
				Round:
				<input type="number" bind:value={roundNumber} />
			</label>
			<label>
				Question Number:
				<input type="number" bind:value={questionNumber} />
			</label>
			<label>
				Title:
				<input class="full-width" type="text" bind:value={questionTitle} />
			</label>
			<label>
				Text
				<textarea class="full-width" bind:value={questionText} />
			</label>
		</form>
		<hr />
		<Button on:click={onClose}>Close</Button>
		<Button type="submit" on:click={onSave}>Save</Button>
	</div>
</div>

<style>
	.modal {
		position: absolute;
		background-color: grey;
		display: flex;
		align-items: center;
		justify-content: center;
		top: 0;
		left: 0;
		height: 100vh;
		width: 100vw;
	}
	.content {
		position: relative;
		width: 70%;
		height: 70%;
		background-color: aliceblue;
		padding: 2rem;
		border-radius: 0.5rem;
	}
	label {
		display: block;
		margin-top: 1rem;
	}
	.full-width {
		width: 100%;
	}
	textarea {
		height: 10rem;
	}
</style>
