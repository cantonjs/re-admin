import {
	isObservableArray,
	computed,
	autorun,
	observable,
	action,
	toJS,
} from 'mobx';

class NaviStore {
	@observable _openKeys = [];
	@observable
	state = {
		menuKey: '',
	};

	@computed
	get openKeys() {
		return __DEV__ ? toJS(this._openKeys) : this._openKeys;
	}
	set openKeys(openKeys) {
		this._openKeys = openKeys;
	}

	@computed
	get selectedKeys() {
		return [this.state.menuKey];
	}

	@action
	setState(state) {
		this.state = state;
	}

	@action
	setBreadcrumbTitle(breadcrumbTitle) {
		this.state = { ...this.state, breadcrumbTitle };
	}

	init(menuArray, location) {
		this._location = location;
		this._menuArray = menuArray;

		this.disposer = autorun(() => {
			const { pathname } = this._location;
			const findMenuTree = (menuArray, paths) => {
				if (!menuArray) {
					return;
				}
				if (Array.isArray(menuArray) || isObservableArray(menuArray)) {
					for (const menu of menuArray) {
						if (menu.path === pathname) {
							return paths;
						}
						const matched = findMenuTree(
							menu.children,
							paths.concat(menu.menuKey)
						);
						if (matched) {
							return matched;
						}
					}
				}
			};

			this._openKeys = findMenuTree(menuArray, []);
		});

		return this;
	}
}

export default new NaviStore();
