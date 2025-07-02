<script lang="ts">
	import { onMount } from 'svelte';
	import { user, loadUserProfile } from '$lib/stores/user';
	import { updateProfile } from '$lib/api/wordpress';
	import { toast } from '@zerodevx/svelte-toast'; // kalau kamu pakai toast (opsional)

	let loading = true;
	let saving = false;

	// Form data
	let first_name = '-';
	let last_name = '-';
	let name = '-';
	let description = '-';
	let email = '-';

	let tempValue = '';

	// load profil dan isi form
	onMount(async () => {
		await loadUserProfile();
		if ($user) {
			fillForm();
		}
		loading = false;
	});

	function fillForm() {
		first_name = $user.first_name || '';
		last_name = $user.last_name || '';
		name = $user.name || '';
		description = $user.description || '';
		email = $user.email || '';
	}

	async function saveProfile() {
		saving = true;
		try {
			await updateProfile({ first_name, last_name, name, description });
			await loadUserProfile(); // refresh store
			toast.push('Profil berhasil diperbarui');
		} catch (err) {
			console.error(err);
			toast.push('Gagal menyimpan profil');
		} finally {
			saving = false;
		}
	}
</script>

<div class="mx-auto w-full">
	<h1 class="mb-6 text-2xl font-bold">Profil Pengguna</h1>

	{#if loading}
		<p>Memuat profil...</p>
	{:else if $user}
		<div class="space-y-6 rounded-xl bg-white p-6 shadow">
			<!-- Form -->
			<div class="flex w-full flex-col gap-4">
				<div class="flex w-full items-center">
					<label for="first-name" class="basis-1/5 text-sm text-gray-600">Nama Depan :</label>
					<input
						id="first-name"
						type="text"
						class="input basis-4/5 border-b-2 border-gray-300 p-1 focus:border-blue-600 focus:ring-0 focus:outline-none"
						bind:value={first_name}
					/>
				</div>
				<div class="flex w-full items-center">
					<label for="last-name" class="basis-1/5 text-sm text-gray-600">Nama Belakang :</label>
					<input
						id="last-name"
						type="text"
						class="input basis-4/5 border-b-2 border-gray-300 p-1 focus:border-blue-600 focus:ring-0 focus:outline-none"
						bind:value={last_name}
					/>
				</div>
				<div class="flex w-full items-center">
					<label for="display-name" class="basis-1/5 text-sm text-gray-600"
						>Nama Yang Ditampilkan di Profil :
					</label>
					<input
						id="display-name"
						type="text"
						class="input basis-4/5 border-b-2 border-gray-300 p-1 focus:border-blue-600 focus:ring-0 focus:outline-none"
						bind:value={name}
					/>
				</div>
				<div class="flex w-full items-center">
					<label for="email" class="basis-1/5 text-sm text-gray-600">Email :</label>
					<input
						id="email"
						type="text"
						class="input basis-4/5 border-b-2 border-gray-300 p-1 focus:border-blue-600 focus:ring-0 focus:outline-none"
						bind:value={email}
					/>
				</div>
				<div class="flex flex-col">
					<label for="bio" class="text-sm text-gray-600">Biografi Singkat :</label>
					<textarea
						id="bio"
						class="input mt-2 rounded-xl p-2 outline-2 outline-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none"
						rows="4"
						bind:value={description}
					></textarea>
				</div>
				<div>
					<label for="user-role" class="text-sm text-gray-600">Role: </label>
					<p id="user-role" class="text-gray-800 capitalize">{$user.roles?.[0]}</p>
				</div>
			</div>
			<!-- Tombol -->
			<div class="flex justify-between font-semibold">
				<a
					href="/admin"
					class="flex w-fit items-center hover:text-red-600"
					aria-label="Kembali ke Dashboard"><i class="fas fa-arrow-left p-1"></i>Kembali</a
				>
				<button
					on:click={saveProfile}
					class="btn-primary mr-2 hover:cursor-pointer hover:text-blue-800"
				>
					<i class="far fa-floppy-disk"></i>
					{saving ? 'Menyimpan...' : 'Simpan'}
				</button>
			</div>
		</div>
	{:else}
		<p class="text-red-500">Profil tidak tersedia.</p>
	{/if}
</div>

<style>
</style>
