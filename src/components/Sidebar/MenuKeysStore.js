import { isObservableArray, computed, autorun, observable, toJS } from 'mobx';

export default class MenuKeysStore {
	@computed
	get selectedKeys() {
		return [this._location.pathname];
	}

	@observable _openKeys = [];

	@computed
	get openKeys() {
		return __DEV__ ? toJS(this._openKeys) : this._openKeys;
	}
	set openKeys(openKeys) {
		this._openKeys = openKeys;
	}

	constructor(menus, location) {
		this._location = location;

		this.disposer = autorun(() => {
			const { pathname } = this._location;
			const findMenuTree = (menus, paths) => {
				if (!menus) {
					return;
				}
				if (Array.isArray(menus) || isObservableArray(menus)) {
					for (const menu of menus) {
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

			this._openKeys = findMenuTree(menus, []);
		});
	}
}
