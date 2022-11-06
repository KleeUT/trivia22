import { writable } from 'svelte/store';
type User = { email?: string };

export const isAuthenticated = writable(false);
export const user = writable<User | undefined>({});
export const token = writable<string>('');
