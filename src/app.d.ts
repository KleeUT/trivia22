// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
/// <reference types="@sveltejs/adapter-cloudflare" />

declare namespace App {
	interface Platform {
		env?: {
			QUESTION_STORE: KVNamespace;
			CURRENT_QUESTION_DB: D1Database;
		};
	}
}
