import localeStore from 'stores/localeStore';
import LocaleProp from './LocaleProp';

export default function createLocale(name) {
	return Object.keys(localeStore[name]).reduce((acc, key) => {
		acc[key] = new LocaleProp(name, key);
		return acc;
	}, {});
}
