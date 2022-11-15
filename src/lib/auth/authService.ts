import { Auth0Client, createAuth0Client, type RedirectLoginOptions } from '@auth0/auth0-spa-js';
import { user, isAuthenticated, token } from './authStore';

const authConfig = {
	domain: 'klee-test.au.auth0.com',
	clientId: 'tq1yV8Y0q9avPfRvhPp1PzGQnghDfrGZ'
};
export function authService() {
	let client: Auth0Client | undefined;
	async function createClient() {
		return await createAuth0Client({
			domain: authConfig.domain,
			clientId: authConfig.clientId,
			authorizationParams: {
				redirect_uri: window.location.href,
				audience: 'TheSweetestAPI'
			}
		});
	}

	async function refreshToken(): Promise<boolean> {
		try {
			if (!client) {
				client = await createClient();
			}
			const authToken = await client.getTokenSilently();
			token.set(authToken);
			return true;
		} catch (e) {
			console.error(e);
			return false;
		}
	}

	async function handleRedirect() {
		console.log('redirect');
		if (!window) {
			console.log('no window');
			return;
		}
		if (!client) {
			client = await createClient();
		}
		if (window.location.href.includes('code=')) {
			console.log('Handling callback');
			await client.handleRedirectCallback();
			const authToken = await client.getTokenSilently();
			token.set(authToken);
			const userFromAuth0 = await client.getUser();
			if (userFromAuth0) {
				user.set(userFromAuth0);
			}
			console.log({ userFromAuth0, token, query: window.location.search });
			window.history.replaceState({}, '', window.location.origin + window.location.pathname);
			// window.location.search = '';
		} else {
			console.log('Refresh');
			await refreshToken();
		}
	}

	async function loginWithRedirect() {
		console.log('loginWithRedirect');
		if (!client) {
			client = await createClient();
		}
		try {
			console.log('login with redirect');
			await client.loginWithRedirect({
				authorizationParams: {
					redirect_uri: window.location.origin + window.location.pathname
				}
			});
		} catch (e) {
			console.error(e);
		}
	}

	async function logout() {
		if (!client) {
			client = await createClient();
		}
		return client.logout({
			logoutParams: { returnTo: window.location.origin + window.location.pathname }
		});
	}
	return {
		refreshToken,
		loginWithRedirect,
		handleRedirect,
		logout,
		user,
		isAuthenticated,
		token
	};
}
