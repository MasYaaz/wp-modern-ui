<script lang="ts">
	import { login } from '$lib/api/wordpress';
	import { goto } from '$app/navigation';
	let username = '', password = '', error = '', loading = false;

	async function handleLogin() {
		error = '';
		loading = true;
		try {
			const res = await login(username, password);
			localStorage.setItem('token', res.token);
			goto('/admin');
		} catch (err: any) {
			error = err.message || 'Login gagal';
		} finally {
			loading = false;
		}
	}
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
	<div class="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
		<h1 class="text-2xl font-bold mb-4 text-center">Login Admin</h1>

		{#if error}
			<div class="text-red-600 text-sm mb-4">{error}</div>
		{/if}

		<input
			type="text"
			placeholder="Username"
			bind:value={username}
			class="w-full p-2 border border-gray-300 rounded mb-3 focus:outline-none focus:ring focus:ring-blue-400"
		/>
		<input
			type="password"
			placeholder="Password"
			bind:value={password}
			class="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring focus:ring-blue-400"
		/>
		<button
			on:click={handleLogin}
			class="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
			disabled={loading}
		>
			{loading ? 'Masuk...' : 'Login'}
		</button>
	</div>
</div>
