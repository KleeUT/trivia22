<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	export let size: 'large' | 'normal' = 'normal';
	export let type: 'button' | 'menu' | 'submit' = 'button';
	const click = (e: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) => {
		dispatch('click', e);
	};
</script>

<button {type} class={size} on:click={click}><slot /></button>

<style>
	button {
		background: white;
		border: 1px solid blue;
		color: blue;
		cursor: pointer;
		border-radius: 3px;
	}
	button.large {
		padding: 1rem;
		border: 2px solid blue;
	}
</style>
