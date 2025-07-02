import { writable } from 'svelte/store';
export const sidebarCollapsed = writable(false); // dekstop
export const sidebarOpen = writable(false); // mobile