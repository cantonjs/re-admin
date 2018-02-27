import localeStore from 'stores/localeStore';

export default function getLocaleValues(name) {
	return Object.keys(localeStore[name]).reduce((acc, key) => {
		return Object.defineProperty(acc, key, {
			enumerable: true,
			get() {
				return localeStore[name][key];
			},
		});
	}, {});
}
