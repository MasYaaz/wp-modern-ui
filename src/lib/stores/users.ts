import { writable, get } from 'svelte/store';
import { getUsers as fetchUsers } from '$lib/api/wordpress';

export const users = writable<any[]>([]);
export const usersLoaded = writable(false);

export async function loadUsers() {
	if (get(usersLoaded)) return;
	const data = await fetchUsers();
	users.set(data);
	usersLoaded.set(true);
}

export function resetUsers() {
	users.set([]);
	usersLoaded.set(false);
}
