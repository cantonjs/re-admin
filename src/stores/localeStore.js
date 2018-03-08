import { observable, action } from 'mobx';
import defaultLocale from 'locales/en.json';

const localeStore = observable({
	...defaultLocale,
	set: action.bound(function setLocale(values) {
		Object.assign(this, values);
	}),
});

export default localeStore;
