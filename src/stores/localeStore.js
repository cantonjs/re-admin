import { observable, action } from 'mobx';

class LocaleStore {
	@observable
	LoginForm = {
		usernamePlaceholder: 'User',
		passwordPlaceholder: 'Password',
		login: 'Login',
	};

	@observable
	CreateButton = {
		label: 'Create',
	};

	@observable
	RefButton = {
		label: 'Reference',
	};

	@observable
	RemoveButton = {
		label: 'Remove',
		multiLabel: 'Batch Remove',
		title: 'Are you absolutely sure to remove?',
		content: 'This operation cannot be undone!',
	};

	@observable
	ClearSortButton = {
		label: 'Reset Sorting',
	};

	@observable
	TableQuery = {
		search: 'Search',
		reset: 'Reset',
		resetOrder: 'Reset Sorting',
	};

	@observable
	TableBody = {
		total: 'Total',
	};

	@observable
	TableQuerySwitch = {
		label: 'Search',
	};

	@observable
	UpdateButton = {
		label: 'Update',
		multiLabel: 'Batch Update',
	};

	@observable
	UserMenu = {
		confirmSignOut: 'Are you sure to sign out?',
		signOut: 'Sign out',
	};

	@observable
	ActionsField = {
		label: 'Actions',
	};

	@observable
	ArrayOf = {
		addButtonLabel: 'Add item',
	};

	@observable
	requests = {
		failed: 'Failed',
		fetchFailed: 'Load failed',
		createFailed: 'Create failed',
		updateFailed: 'Update failed',
		removeFailed: 'Remove failed',
		loginFailed: 'Login failed',
		loginSuccess: 'Login success',
		invalidToken: 'Invalid auth token',
	};

	@action
	set(values) {
		Object.assign(this, values);
	}
}

export default new LocaleStore();
