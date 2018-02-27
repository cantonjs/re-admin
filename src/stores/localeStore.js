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
		title: 'Remove?',
		content: 'This operation cannot be undone!',
	};

	@observable
	ClearSortButton = {
		label: 'Reset Sorting',
	};

	@observable
	TableQuery = {
		query: 'Query',
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

	@action
	set(values) {
		Object.assign(this, values);
	}
}

export default new LocaleStore();
