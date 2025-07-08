import { writable } from 'svelte/store';
import { getPostsCount, getCommentsCount, getUsers } from '$lib/api/wordpress';

export const counts = writable({
  posts: 0,
  comments: 0,
  users: 0,
});

let loaded = false;

export async function loadCounts() {
  if (loaded) return;

  const [posts, comments, users] = await Promise.all([
    getPostsCount(),
    getCommentsCount(),
    getUsers().then((u) => u.length)
  ]);

  counts.set({ posts, comments, users });
  loaded = true;
}

export function resetCounts() {
  loaded = false;
}
