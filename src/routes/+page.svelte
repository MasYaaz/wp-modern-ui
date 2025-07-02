<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let token: string | null = null;

	onMount(() => {
		token = localStorage.getItem('token');

		// Kalau belum login, arahkan ke /login
		if (!token) {
			goto('/login');
		}

		if (token) {
			goto('/admin')
		}
	});
</script>
