export async function apiFetch(path: string, options: RequestInit & { isFormData?: boolean } = {}) {
	const token = localStorage.getItem('token');
	const headers: Record<string, string> = {};

	if (token) {
		headers['Authorization'] = `Bearer ${token}`;
	}

	// Jika bukan FormData, tambahkan Content-Type JSON
	if (!options.isFormData) {
		headers['Content-Type'] = 'application/json';
	}

	const res = await fetch(`${import.meta.env.VITE_API_URL}${path}`, {
		...options,
		headers: {
			...headers,
			...(options.headers || {})
		}
	});

	if (!res.ok) {
		const err = await res.json().catch(() => ({}));
		throw new Error(err.message || `API error: ${res.status}`);
	}

	return await res.json();
}
