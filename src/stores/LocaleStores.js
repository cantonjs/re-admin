import { observable, action } from 'mobx';
import defaultLocale from '../../locales/en_US';

const localeStores = new Map();
let localeData = defaultLocale;

export default class LocaleStore {
	static ensure(name) {
		if (localeStores.has(name)) return localeStores.get(name);
		const data = localeData[name];
		const locale = new LocaleStore(data);
		localeStores.set(name, locale);
		return locale;
	}

	static test(name) {
		return localeData.hasOwnProperty(name);
	}

	static setLocale(newLocale) {
		if (localeData !== newLocale) {
			localeData = newLocale;
			for (const [name, localeStore] of localeStores) {
				localeStore._setData(localeData[name]);
			}
		}
	}

	constructor(data) {
		this.data = observable(data);
	}

	localizeProp(prop, key) {
		return prop === undefined ? this.data[key] : prop;
	}

	localize(props, exclude) {
		return Object.keys(this.data).reduce((acc, key) => {
			const propValue = props[key];
			if (!exclude || !~exclude.indexOf(key)) {
				acc[key] = propValue === undefined ? this.data[key] : propValue;
			}
			return acc;
		}, {});
	}

	@action
	_setData(data) {
		this.data = data;
	}
}
