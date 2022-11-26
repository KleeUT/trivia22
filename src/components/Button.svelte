<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	export let size: 'large' | 'normal' = 'normal';
	export let type: 'button' | 'menu' | 'submit' = 'button';
	export let disabled = false;
	const click = (e: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) => {
		dispatch('click', e);
	};
</script>

<button {type} class={size} {disabled} on:click={click}><slot /></button>

<style>
	button {
		padding: 0.5rem;
		background: darkred;
		cursor: pointer;
		color: white;
		border-radius: 0.5rem;
		padding-left: 1rem;
		padding-right: 1rem;
	}
	button.large {
		padding: 1rem;
		padding-right: 1.5rem;
		padding-left: 1.5rem;
	}
	button:disabled {
		background-color: grey;
	}
</style>
