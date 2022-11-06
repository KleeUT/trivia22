<script lang="ts">
	import { onMount } from 'svelte';
	import { authService } from '../../lib/auth/authService';
	let userValue: Object | undefined;
	let token = 'No token yet';
	const auth = authService();
	auth.user.subscribe((u) => {
		userValue = u;
	});
	auth.token.subscribe((t) => {
		token = t;
	});
	onMount(async () => {
		await auth.handleRedirect();
	});
	async function login() {
		console.log('login');
		await auth.loginWithRedirect();
	}
	async function logout() {
		await auth.logout();
	}
</script>

<main>
	<h1>Admin</h1>
	<button on:click={login}>Login</button>
	<button on:click={logout}>Logout</button>
	<pre>{JSON.stringify(userValue)}</pre>
	<pre>{token}</pre>
</main>
