import { resetUserProfile } from './user';
import { resetPosts } from './posts';
import { resetUsers } from './users';
import { resetComments } from './comments';

export function resetAllStores() {
	resetUserProfile();
	resetPosts();
	resetUsers();
	resetComments();
}
