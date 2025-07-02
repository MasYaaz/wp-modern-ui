// untuk periksa keamanan
import { goto } from '$app/navigation';

export function protectRoute() {
	if (typeof window !== 'undefined') {
		const token = localStorage.getItem('token');
		if (!token) goto('/login');
	}
}
