<script lang="ts">
	import Button from '../../../components/Button.svelte';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	export let allRounds: number[] = [];

	function setRound(r: number) {
		dispatch('roundSet', r);
	}
</script>

<div class="control-block">
	{#each allRounds as round}
		<span>
			<Button on:click={() => setRound(round)}>{round}</Button>
		</span>
	{/each}
</div>

<style>
	span {
		margin: 0.5rem;
	}
	.control-block {
		padding: 1rem;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1rem;
	}
</style>
